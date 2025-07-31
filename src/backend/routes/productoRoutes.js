// routes/productoRoutes.js
const express = require('express');
const router = express.Router();
const { obtenerProductos, obtenerProductoPorId } = require('../controllers/productoController');

// Ruta para obtener todos los productos
// GET /api/productos
router.get('/', obtenerProductos);

// Ruta para obtener un producto por su ID
// GET /api/productos/:id
router.get('/:id', obtenerProductoPorId);

module.exports = router;