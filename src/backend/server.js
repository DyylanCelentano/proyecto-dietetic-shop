const conectarDB = require('./config/db');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carga las variables de entorno

// Conectar a la base de datos
conectarDB();

// Inicializar la app de Express
const app = express();

// Middlewares
app.use(cors()); // Permite peticiones de otros orígenes (tu frontend)
app.use(express.json()); // Permite al servidor entender JSON

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: '¡Bienvenido a la API de Dietetic-Shop!' });
});

app.use('/api/productos', require('./routes/productoRoutes'));

// Puerto del servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});