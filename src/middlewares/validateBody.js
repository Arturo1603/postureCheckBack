import { error } from '../utils/response.js'

export const validateBody = (fields) => (req, res, next) => {
  const missing = fields.filter(f => !req.body[f] && req.body[f] !== 0)
  if (missing.length > 0)
    return error(res, `Campos requeridos: ${missing.join(', ')}`, 400)
  next()
}
