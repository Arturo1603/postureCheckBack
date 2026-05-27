import pool from '../config/db.js'

export const EvaluacionModel = {
  findAll: async (user_id, { search = '', page = 1, limit = 10 } = {}) => {
    const offset = (page - 1) * limit
    const searchParam = `%${search}%`

    const { rows } = await pool.query(
      `SELECT * FROM evaluaciones
       WHERE user_id = $1
         AND (zona ILIKE $2 OR causa ILIKE $2 OR comentario ILIKE $2)
       ORDER BY fecha DESC
       LIMIT $3 OFFSET $4`,
      [user_id, searchParam, limit, offset]
    )

    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM evaluaciones
       WHERE user_id = $1
         AND (zona ILIKE $2 OR causa ILIKE $2 OR comentario ILIKE $2)`,
      [user_id, searchParam]
    )

    return {
      data: rows,
      total: parseInt(countRows[0].count),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countRows[0].count) / limit)
    }
  },

  findById: async (id, user_id) => {
    const { rows } = await pool.query(
      'SELECT * FROM evaluaciones WHERE id = $1 AND user_id = $2',
      [id, user_id]
    )
    return rows[0]
  },

  create: async ({ user_id, zona, intensidad, causa, comentario }) => {
    const { rows } = await pool.query(
      `INSERT INTO evaluaciones (user_id, zona, intensidad, causa, comentario)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, zona, intensidad, causa || null, comentario || null]
    )
    return rows[0]
  },

  update: async (id, user_id, { zona, intensidad, causa, comentario }) => {
    const { rows } = await pool.query(
      `UPDATE evaluaciones
       SET zona = $1, intensidad = $2, causa = $3, comentario = $4
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [zona, intensidad, causa || null, comentario || null, id, user_id]
    )
    return rows[0]
  },

  delete: async (id, user_id) => {
    const { rows } = await pool.query(
      'DELETE FROM evaluaciones WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, user_id]
    )
    return rows[0]
  },

  getStats: async (user_id) => {
    const { rows } = await pool.query(
      `SELECT
        COUNT(*) AS total,
        ROUND(AVG(intensidad), 1) AS promedio_dolor,
        (SELECT zona FROM evaluaciones WHERE user_id = $1
         GROUP BY zona ORDER BY COUNT(*) DESC LIMIT 1) AS zona_frecuente,
        (SELECT fecha FROM evaluaciones WHERE user_id = $1
         ORDER BY fecha DESC LIMIT 1) AS ultima_fecha
       FROM evaluaciones WHERE user_id = $1`,
      [user_id]
    )
    return rows[0]
  },

  getLast7Days: async (user_id) => {
    const { rows } = await pool.query(
      `SELECT
        TO_CHAR(fecha, 'Dy') AS dia,
        ROUND(AVG(intensidad), 1) AS dolor
       FROM evaluaciones
       WHERE user_id = $1
         AND fecha >= NOW() - INTERVAL '7 days'
       GROUP BY TO_CHAR(fecha, 'Dy'), DATE(fecha)
       ORDER BY DATE(fecha) ASC`,
      [user_id]
    )
    return rows
  },

  getZonasFrecuentes: async (user_id) => {
    const { rows } = await pool.query(
      `SELECT zona, COUNT(*) AS total
       FROM evaluaciones WHERE user_id = $1
       GROUP BY zona ORDER BY total DESC LIMIT 5`,
      [user_id]
    )
    return rows
  }
}
