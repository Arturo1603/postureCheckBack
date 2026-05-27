import { Router } from 'express'
import {
  getAll, getById, create, update, remove,
  getRecomendaciones, getDashboard
} from '../controllers/evaluaciones.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { validateBody } from '../middlewares/validateBody.js'

const router = Router()

router.use(authMiddleware)

router.get('/dashboard', getDashboard)
router.get('/recomendaciones/:zona', getRecomendaciones)
router.get('/', getAll)
router.get('/:id', getById)
router.post('/', validateBody(['zona', 'intensidad']), create)
router.put('/:id', validateBody(['zona', 'intensidad']), update)
router.delete('/:id', remove)

export default router
