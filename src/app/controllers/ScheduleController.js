import { startOfDay, endOfDay, parseISO } from 'date-fns'
import { Op } from 'sequelize'
import Appointment from '../models/Appointment'
import User from '../models/User'

class ScheduleController {
  async index(req, res) {
    const isUserAProvider =
      (await User.count({
        where: { id: req.user.id, provider: true },
      })) > 0

    if (!isUserAProvider) {
      return res.send()
    }

    const { date } = req.query
    const parsedDate = parseISO(date)
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.user.id,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
      include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
    })

    return res.send({ appointments })
  }
}

export default new ScheduleController()
