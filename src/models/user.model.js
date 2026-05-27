import pool from '../config/db.js'

export const UserModel = {
  findByEmail: async (email) => {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return rows[0]
  },

  findById: async (id) => {
    const { rows } = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [id]
    )
    return rows[0]
  },

  create: async ({ name, email, password_hash }) => {
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, password_hash]
    )
    return rows[0]
  }
}
