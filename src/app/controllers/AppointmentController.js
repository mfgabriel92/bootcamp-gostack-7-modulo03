import Appointment from '../models/Appointment'
import User from '../models/User'
import appointmentRules from '../../utils/validators/appointment'
import HTTP from '../../utils/httpResponse'

class AppointmentController {
  async store(req, res) {
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

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    })

    return res.status(HTTP.CREATED).json({ appointment })
  }
}

export default new AppointmentController()
