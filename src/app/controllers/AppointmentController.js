import { startOfHour, parseISO, isBefore } from 'date-fns'
import Appointment from '../models/Appointment'
import User from '../models/User'
import appointmentRules from '../../utils/validators/appointment'
import HTTP from '../../utils/httpResponse'

class AppointmentController {
  async store(req, res) {
    console.log(req.body)

    try {
      await appointmentRules.validate(req.body, { abortEarly: false })
    } catch (e) {
      return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
    }
    const { provider_id, date } = req.body

    const user = await User.findOne({
      where: { id: provider_id, provider: true },
    })

    if (req.userId === provider_id) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ error: 'You cannot create an appointment with yourself' })
    }

    if (!user) {
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

    return res.status(HTTP.CREATED).json({ appointment })
  }
}

export default new AppointmentController()
