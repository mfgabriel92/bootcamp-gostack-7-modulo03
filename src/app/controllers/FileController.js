import File from '../models/File'
import User from '../models/User'

class FileController {
  /**
   * Faz o upload de uma imagem
   *
   * @param {Request} req
   * @param {Response} res
   */
  async store(req, res) {
    const { filename: name } = req.file
    const file = await File.create({ name })

    await User.update({ avatar_id: file.id }, { where: { id: req.userId } })

    return res.json({ file })
  }
}

export default new FileController()
