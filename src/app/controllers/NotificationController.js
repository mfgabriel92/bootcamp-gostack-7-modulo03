import HTTP from '../../utils/httpResponse'
import Notification from '../schemas/Notification'
import User from '../models/User'

class NotificationController {
  /**
   * Lists all the provider's notifications
   *
   * @param {Request} req
   * @param {Response} res
   */
  async index(req, res) {
    const provider = await User.findOne({
      where: { id: req.userId, provider: true },
    })

    if (!provider) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json({ error: 'Operation available only for providers' })
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20)

    return res.json({ notifications })
  }

  /**
   * Marks a notification as read
   *
   * @param {Request} req
   * @param {Response} res
   */
  async update(req, res) {
    const { id } = req.params
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    )

    return res.json({ notification })
  }
}

export default new NotificationController()
