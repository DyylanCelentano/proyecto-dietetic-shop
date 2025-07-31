const express = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')
const { validarAuth } = require('../middleware/auth')

const router = express.Router()

// Registrar usuario
router.post('/registro', async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email })
    if (usuarioExistente) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Ya existe un usuario con este email'
      })
    }

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      email,
      password
    })

    await nuevoUsuario.save()

    // Generar token
    const token = jwt.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET || 'secreto-temporal',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: nuevoUsuario
    })

  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    })
  }
})

// Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Buscar usuario
    const usuario = await Usuario.findOne({ email, activo: true })
    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales inválidas'
      })
    }

    // Verificar contraseña
    const passwordValida = await usuario.compararPassword(password)
    if (!passwordValida) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales inválidas'
      })
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET || 'secreto-temporal',
      { expiresIn: '7d' }
    )

    res.json({
      exito: true,
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario
    })

  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    })
  }
})

// Obtener perfil del usuario
router.get('/perfil', validarAuth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id)
    res.json({
      exito: true,
      usuario
    })
  } catch (error) {
    console.error('Error obteniendo perfil:', error)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    })
  }
})

module.exports = router