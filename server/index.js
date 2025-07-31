const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

// Importar rutas
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dietetic-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((error) => console.error('❌ Error conectando a MongoDB:', error))

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ mensaje: 'Servidor funcionando correctamente' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
})