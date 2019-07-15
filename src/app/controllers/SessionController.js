import jwt from 'jsonwebtoken'
import User from '../models/User'
import File from '../models/File'
import HTTP from '../../utils/httpResponse'
import session from '../../utils/validators/session'

class SessionController {
  /**
   * Authenticates an user
   *
   * @param {Request} req request
   * @param {Reponse} res response
   */
  async store(req, res) {
    try {
      await session.validate(req.body, { abortEarly: false })
    } catch (e) {
      return res.status(HTTP.BAD_REQUEST).json({ error: e.errors })
    }

    const { email, password } = req.body
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
        },
      ],
    })

    if (!user || !(await user.isPasswordCorrect(password))) {
      return res
        .status(HTTP.UNAUTHORIZED)
        .json({ error: 'Credentials do not match' })
    }

    return res.json({
      user,
      token: jwt.sign({ id: user.id }, '374h0f83741h023947d2g34g6f26349hf263', {
        expiresIn: '7d',
      }),
    })
  }
}

export default new SessionController()
