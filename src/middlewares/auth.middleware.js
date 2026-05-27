import jwt from 'jsonwebtoken'
import { error } from '../utils/response.js'

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer '))
    return error(res, 'Token requerido', 401)

  const token = authHeader.split(' ')[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return error(res, 'Token inválido o expirado', 401)
  }
}
