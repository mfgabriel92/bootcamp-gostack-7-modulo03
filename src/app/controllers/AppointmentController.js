import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns'
import Appointment from '../models/Appointment'
import User from '../models/User'
import File from '../models/File'
import Notification from '../schemas/Notification'
import appointmentRules from '../../utils/validators/appointment'
import HTTP from '../../utils/httpResponse'
import Mail from '../../lib/Mail'

class AppointmentController {
  /**
   * Lists all appointments
   *
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const { page = 1 } = req.query

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
            },
          ],
        },
      ],
    })

    res.json({ appointments })
  }

  /**
   * Creates a new appointment
   *
   * @param {Request} req
   * @param {Response} res
   */
  async store(req, res) {
    try {
      await appointmentRules.validate(req.body, { abortEarly: false })
    } catch (e) {
      return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
    }

    const { provider_id, date } = req.body

    if (req.userId === provider_id) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ error: 'You cannot create an appointment with yourself' })
    }

    // Is Provider
    const provider = await User.findOne({
      where: { id: provider_id, provider: true },
    })

    if (!provider) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ error: 'You may only create appointments with providers' })
    }

    // Is before today
    const startingHour = startOfHour(parseISO(date))

    if (isBefore(startingHour, new Date())) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ error: 'Past dates are not allowed' })
    }

    // Availability
    const appointmentDate = await Appointment.count({
      where: { provider_id, canceled_at: null, date: startingHour },
    })

    if (appointmentDate > 0) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ error: 'The selected date is not available' })
    }

    // Creation
    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    })

    // Notify provider
    await Notification.create({
      message: `New schedule with ${req.user.name} at ${format(
        startingHour,
        "Mo 'of' MMMM', at' hh:mm a"
      )}`,
      user: provider_id,
    })

    return res.status(HTTP.CREATED).json({ appointment })
  }

  /**
   * Cancels an appointment
   *
   * @param {Request} req
   * @param {Response} res
   */
  async delete(req, res) {
    const { id } = req.params
    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
      ],
    })

    if (!appointment) {
      return res.status(HTTP.NOT_FOUND).json({
        error: 'Appointment not found',
      })
    }

    if (appointment.user_id !== req.userId) {
      return res.status(HTTP.UNAUTHORIZED).json({
        error: 'You do not have permission to delete this appointment',
      })
    }

    if (appointment.canceled_at) {
      return res.status(HTTP.UNAUTHORIZED).json({
        error: 'The appointment has already been canceled',
      })
    }

    const dateSubbed = subHours(appointment.date, 2)

    if (isBefore(dateSubbed, new Date())) {
      return res.status(HTTP.UNAUTHORIZED).json({
        error:
          'You cannot cancel an appointment less than 2 hours from its scheduled time',
      })
    }

    appointment.canceled_at = new Date()
    await appointment.save()

    await Mail.send({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Scheduled has been canceled',
      text: 'You have a new schedule cancelation',
    })

    return res.json({ appointment })
  }
}

export default new AppointmentController()
