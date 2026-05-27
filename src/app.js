import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
dotenv.config()

import authRoutes from './routes/auth.routes.js'
import evaluacionesRoutes from './routes/evaluaciones.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(helmet())

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin?.endsWith('.vercel.app')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/evaluaciones', evaluacionesRoutes)

app.get('/api/v1/health', (_, res) => {
  res.json({ ok: true, message: 'PostureCheck API running 🚀' })
})

app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Ruta no encontrada', data: null })
})

app.use(errorHandler)

export default app
