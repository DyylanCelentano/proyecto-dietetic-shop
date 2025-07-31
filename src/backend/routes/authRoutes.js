const express = require('express');
const router = express.Router();
const { 
  registrarUsuario, 
  iniciarSesion, 
  obtenerPerfil, 
  verificarToken 
} = require('../controllers/authController');

// Ruta para registrar nuevo usuario
router.post('/registro', registrarUsuario);

// Ruta para iniciar sesión
router.post('/login', iniciarSesion);

// Ruta para obtener perfil del usuario (requiere autenticación)
router.get('/perfil', verificarToken, obtenerPerfil);

module.exports = router; 