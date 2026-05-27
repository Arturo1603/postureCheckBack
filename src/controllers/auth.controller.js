import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserModel } from '../models/user.model.js'
import { success, error } from '../utils/response.js'

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const exists = await UserModel.findByEmail(email)
    if (exists) return error(res, 'El correo ya está registrado', 400)

    const password_hash = await bcrypt.hash(password, 10)
    const user = await UserModel.create({ name, email, password_hash })
    const token = generateToken(user)

    return success(res, { user, token }, 'Registro exitoso', 201)
  } catch (err) { next(err) }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findByEmail(email)
    if (!user) return error(res, 'Credenciales inválidas', 401)

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) return error(res, 'Credenciales inválidas', 401)

    const token = generateToken(user)
    const { password_hash, ...userData } = user

    return success(res, { user: userData, token }, 'Login exitoso')
  } catch (err) { next(err) }
}

export const me = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id)
    if (!user) return error(res, 'Usuario no encontrado', 404)
    return success(res, user)
  } catch (err) { next(err) }
}
