import express from 'express';
import {
    obtenerAlertas,
    obtenerDatosVentas,
    obtenerEstadisticas,
    obtenerProductosMasVendidos,
    obtenerResumenUsuarios,
    verificarAdmin
} from '../controllers/adminController.js';
import { verificarToken } from '../middleware/authMiddleware.js';
const router = express.Router();

// Middleware para todas las rutas de admin
router.use(verificarToken);
router.use(verificarAdmin);

// Rutas del dashboard
router.get('/stats', obtenerEstadisticas);
router.get('/ventas', obtenerDatosVentas);
router.get('/productos-mas-vendidos', obtenerProductosMasVendidos);
router.get('/alertas', obtenerAlertas);
router.get('/usuarios/resumen', obtenerResumenUsuarios);

// Ruta de prueba para verificar permisos
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Acceso administrativo confirmado',
        usuario: {
            id: req.usuario._id,
            username: req.usuario.username,
            email: req.usuario.email,
            rol: req.usuario.rol,
            isAdmin: req.usuario.rol === 'admin' // Compatibilidad con frontend
        }
    });
});

export default router; 