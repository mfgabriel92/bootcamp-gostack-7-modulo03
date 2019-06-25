import User from '../models/User'
import HTTP from '../../utils/httpResponse'
import { newUser, updateUser } from '../../utils/validators/user'

class UserController {
  /**
   * Creates a new user
   *
   * @param {Request} req request
   * @param {Reponse} res response
   */
  async store(req, res) {
    const { body } = req
    const user = await User.findOne({ where: { email: body.email } })

    try {
      await newUser.validate(req.body, { abortEarly: false })
    } catch (e) {
      return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
    }

    if (user) {
      return res
        .status(HTTP.BAD_REQUEST)
        .json({ error: 'The e-mail is already used' })
    }

    const { id, name, email, provider } = await User.create(body)

    return res.status(HTTP.CREATED).json({ id, name, email, provider })
  }

  /**
   * Updates an existing user
   *
   * @param {Request} req request
   * @param {Reponse} res response
   */
  async update(req, res) {
    const { email, oldPassword } = req.body
    const user = await User.findByPk(req.userId)

    try {
      await updateUser.validate(req.body, { abortEarly: false })
    } catch (e) {
      return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
    }

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
