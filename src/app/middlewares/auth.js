import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import HTTP from '../../utils/httpResponse'

export default async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(HTTP.UNAUTHORIZED).json({ error: 'Unauthorized access' })
  }

  const [, token] = authorization.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    req.userId = decoded.id

    return next()
  } catch (e) {
    return res.status(HTTP.UNAUTHORIZED).json({ error: e.message })
  }
}
