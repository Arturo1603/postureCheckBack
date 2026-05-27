export const success = (res, data, message = 'OK', status = 200) =>
  res.status(status).json({ ok: true, message, data })

export const error = (res, message = 'Error', status = 500) =>
  res.status(status).json({ ok: false, message, data: null })
