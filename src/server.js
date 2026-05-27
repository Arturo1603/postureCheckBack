import app from './app.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 PostureCheck API corriendo en puerto ${PORT}`)
  console.log(`📦 Entorno: ${process.env.NODE_ENV || 'development'}`)
})
