import HTTP from '../../utils/httpResponse'
import Notification from '../schemas/Notification'

class NotificationController {
  /**
   * Lists all the notifications of the schedules
   *
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    if (!req.user.provider) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json({ error: 'Operation available only for providers' })
    }

    const notifications = await Notification.find({
      user: req.user.id,
    })
      .sort({ createdAt: 'desc' })
      .limit(20)

    return res.json({ notifications })
  }
}

export default new NotificationController()
