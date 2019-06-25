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
    return res.json()
  }
}

export default new UserController()
