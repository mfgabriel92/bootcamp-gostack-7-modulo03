import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns'
import { Op } from 'sequelize'
import Appointment from '../models/Appointment'
import HTTP from '../../utils/httpResponse'
import hours from '../../utils/hours'

class AvailableController {
  /**
   * Fetches available hours for the given day
   *
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const { id } = req.params
    let { date } = req.query

    if (!date) {
      return res.status(HTTP.BAD_REQUEST).json({ error: 'Invalid date' })
    }

    date = Number(date)

    const appointments = await Appointment.findAll({
      where: {
        provider_id: id,
        date: {
          [Op.between]: [startOfDay(date), endOfDay(date)],
        },
      },
    })

    const available = hours.map(hour => {
      const [h, m] = hour.split(':')
      const value = setSeconds(setMinutes(setHours(date, h), m), 0)

      return {
        hour,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available:
          isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === hour),
      }
    })

    return res.json({ available })
  }
}

export default new AvailableController()
