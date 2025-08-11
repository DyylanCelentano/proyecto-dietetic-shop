import express from 'express'
import {
    actualizarPerfil,
    cambiarPassword,
    iniciarSesion,
    obtenerPerfil,
    registrarUsuario,
    verificarToken
} from '../controllers/authController.js'
const router = express.Router()

// Ruta para registrar nuevo usuario
router.post('/registro', registrarUsuario)

// Ruta para iniciar sesión
router.post('/login', iniciarSesion)

// Ruta para obtener perfil del usuario (requiere autenticación)
router.get('/perfil', verificarToken, obtenerPerfil)

// Ruta para actualizar perfil del usuario (requiere autenticación)
router.put('/perfil', verificarToken, actualizarPerfil)

// Ruta para cambiar la contraseña del usuario (requiere autenticación)
router.post('/cambiar-password', verificarToken, cambiarPassword)

export default router 