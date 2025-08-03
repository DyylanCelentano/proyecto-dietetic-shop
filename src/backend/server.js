const conectarDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const config = require('./config/config');

// Conectar a la base de datos
conectarDB();

// Inicializar la app de Express
const app = express();

// Middlewares
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
})); // Permite peticiones de otros orígenes (tu frontend)
app.use(express.json()); // Permite al servidor entender JSON

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: '¡Bienvenido a la API de Dietetic-Shop!' });
});

// Rutas de autenticación
app.use('/api/auth', require('./routes/authRoutes'));

// Rutas de productos
app.use('/api/productos', require('./routes/productoRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Puerto del servidor
const PORT = config.port;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});