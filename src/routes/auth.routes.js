import { Router } from 'express'
import { register, login, me } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { validateBody } from '../middlewares/validateBody.js'

const router = Router()

router.post('/register', validateBody(['name', 'email', 'password']), register)
router.post('/login', validateBody(['email', 'password']), login)
router.get('/me', authMiddleware, me)

export default router
