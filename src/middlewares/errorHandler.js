export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`)
  res.status(err.status || 500).json({
    ok: false,
    message: err.message || 'Internal server error',
    data: null
  })
}
