import express from 'express';
import {
    iniciarSesion,
    obtenerPerfil,
    registrarUsuario,
    verificarToken
} from '../controllers/authController.js';
const router = express.Router();

// Ruta para registrar nuevo usuario
router.post('/registro', registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', iniciarSesion);

// Ruta para obtener perfil del usuario (requiere autenticación)
router.get('/perfil', verificarToken, obtenerPerfil);

export default router; 