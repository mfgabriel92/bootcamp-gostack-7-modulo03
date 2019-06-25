import User from '../models/User'
import HTTP from '../../utils/httpResponse'

class UserController {
  async store(req, res) {
    const { body } = req
    const user = await User.findOne({ where: { email: body.email } })

    if (user) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ error: 'The e-mail is already used' })
    }

    const { id, name, email, provider } = await User.create(body)

    return res.status(HTTP.CREATED).json({ id, name, email, provider })
  }

  async update(req, res) {
    const { email, oldPassword } = req.body
    const user = await User.findByPk(req.userId)

    if (email !== user.email) {
      if ((await User.count({ where: { email } })) > 0) {
        return res
          .status(HTTP.BAD_REQUEST)
          .json({ error: 'The e-mail is already used' })
      }
    }

    if (oldPassword && !(await user.isPasswordCorrect(oldPassword))) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json({ error: 'Credentials do not match' })
    }

    const { id, name, provider } = await user.update(req.body)

    return res.json({ id, name, email, provider })
  }
}

export default new UserController()
