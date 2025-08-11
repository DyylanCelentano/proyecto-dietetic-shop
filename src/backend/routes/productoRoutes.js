import express from 'express'
const router = express.Router()

// Importo controladores y middlewares
import {
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    obtenerCategorias,
    obtenerProductoPorId,
    obtenerProductos,
    obtenerTags
} from '../controllers/productoController.js'

import { esAdmin, verificarToken } from '../middleware/authMiddleware.js'

// --- Rutas Públicas (Cualquiera puede ver los productos) ---
router.get('/', obtenerProductos)
router.get('/categorias', obtenerCategorias)
router.get('/tags', obtenerTags)
router.get('/:id', obtenerProductoPorId)

// --- Rutas Protegidas (Solo para Admins) ---

router.post('/', [verificarToken, esAdmin], crearProducto)

router.put('/:id', [verificarToken, esAdmin], actualizarProducto)

router.delete('/:id', [verificarToken, esAdmin], eliminarProducto)

export default router