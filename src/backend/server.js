import cors from 'cors'
import express from 'express'
import config from './config/config.js'
// Rutas de la API
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import productoRoutes from './routes/productoRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
// Conexión a la base de datos
import conectarDB from './config/db.js'

// ! Variables
const app = express()
const PORT = config.port

// ! Configuración de middlewares básicos
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}))
app.use(express.json({ limit: '10mb' })) // Límite para subidas de archivos grandes
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// * Middleware de rutas
app.use('/api/auth', authRoutes)
app.use('/api/productos', productoRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)


// ! Rutas
// * Ruta de health check (sin DB)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    })
})

// * Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: '¡Bienvenido a la API de Dietetic-Shop!' })
})


// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
    console.log(`🌐 URL: http://localhost:${PORT}`)
    console.log(`📊 Health check: http://localhost:${PORT}/health`)
})

// Conectar a la base de datos después de que el servidor esté corriendo
conectarDB().catch(err => {
    console.log('⚠️ Servidor funcionando sin base de datos')
})

// Manejo de cierre graceful (de manera ordenada)
process.on('SIGTERM', () => {
    console.log('🔄 Cerrando servidor...')
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente')
    })
})

export default app