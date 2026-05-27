import { EvaluacionModel } from '../models/evaluacion.model.js'
import pool from '../config/db.js'
import { success, error } from '../utils/response.js'

export const getAll = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query
    const result = await EvaluacionModel.findAll(req.user.id, {
      search,
      page: parseInt(page),
      limit: parseInt(limit)
    })
    return success(res, result)
  } catch (err) { next(err) }
}

export const getById = async (req, res, next) => {
  try {
    const ev = await EvaluacionModel.findById(req.params.id, req.user.id)
    if (!ev) return error(res, 'Evaluación no encontrada', 404)

    const { rows: recomendaciones } = await pool.query(
      'SELECT * FROM recomendaciones WHERE zona = $1',
      [ev.zona]
    )
    return success(res, { ...ev, recomendaciones })
  } catch (err) { next(err) }
}

export const create = async (req, res, next) => {
  try {
    const { zona, intensidad, causa, comentario } = req.body
    const ev = await EvaluacionModel.create({
      user_id: req.user.id,
      zona,
      intensidad: parseInt(intensidad),
      causa,
      comentario
    })
    return success(res, ev, 'Evaluación creada', 201)
  } catch (err) { next(err) }
}

export const update = async (req, res, next) => {
  try {
    const { zona, intensidad, causa, comentario } = req.body
    const ev = await EvaluacionModel.update(req.params.id, req.user.id, {
      zona,
      intensidad: parseInt(intensidad),
      causa,
      comentario
    })
    if (!ev) return error(res, 'Evaluación no encontrada', 404)
    return success(res, ev, 'Evaluación actualizada')
  } catch (err) { next(err) }
}

export const remove = async (req, res, next) => {
  try {
    const ev = await EvaluacionModel.delete(req.params.id, req.user.id)
    if (!ev) return error(res, 'Evaluación no encontrada', 404)
    return success(res, null, 'Evaluación eliminada')
  } catch (err) { next(err) }
}

export const getRecomendaciones = async (req, res, next) => {
  try {
    const { zona } = req.params
    const { rows } = await pool.query(
      'SELECT * FROM recomendaciones WHERE zona = $1 ORDER BY titulo',
      [zona]
    )
    return success(res, rows)
  } catch (err) { next(err) }
}

export const getDashboard = async (req, res, next) => {
  try {
    const [stats, chart, zonas] = await Promise.all([
      EvaluacionModel.getStats(req.user.id),
      EvaluacionModel.getLast7Days(req.user.id),
      EvaluacionModel.getZonasFrecuentes(req.user.id)
    ])
    return success(res, { stats, chart, zonas })
  } catch (err) { next(err) }
}
