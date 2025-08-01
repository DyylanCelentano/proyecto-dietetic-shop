const express = require('express');
const router = express.Router();

// Importo controladores y middlewares
const { 
    obtenerProductos, 
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productoController');

const { verificarToken, esAdmin } = require('../middleware/authMiddleware');

// --- Rutas Públicas (Cualquiera puede ver los productos) ---
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// --- Rutas Protegidas (Solo para Admins) ---

router.post('/', [verificarToken, esAdmin], crearProducto);

router.put('/:id', [verificarToken, esAdmin], actualizarProducto);

router.delete('/:id', [verificarToken, esAdmin], eliminarProducto);

module.exports = router;