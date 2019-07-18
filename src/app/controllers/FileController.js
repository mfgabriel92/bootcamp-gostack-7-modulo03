import File from '../models/File'
import User from '../models/User'
import HTTP from '../../utils/httpResponse'

class FileController {
  /**
   * Faz o upload de uma imagem
   *
   * @param {Request} req
   * @param {Response} res
   */
  async store(req, res) {
    const user = await User.findByPk(req.userId)

    if (!user) {
      return res
        .status(HTTP.NOT_FOUND)
        .json({ error: 'The user does not exist' })
    }

    const { filename: name } = req.file
    const file = await File.create({ name })

    await user.update({ avatar_id: file.id })

    return res.json({ file })
  }
}

export default new FileController()
