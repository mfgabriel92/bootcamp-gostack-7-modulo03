import { startOfDay, endOfDay, parseISO } from 'date-fns'
import { Op } from 'sequelize'
import Appointment from '../models/Appointment'
import User from '../models/User'
import HTTP from '../../utils/httpResponse'

class ScheduleController {
  async index(req, res) {
    const provider = await User.findOne({
      where: { id: req.userId, provider: true },
    })

    if (!provider) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json({ error: 'Operation available only for providers' })
    }

    const { date } = req.query
    const parsedDate = parseISO(date)
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name'],
      },
    })

    return res.send({ appointments })
  }
}

export default new ScheduleController()
