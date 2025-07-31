const jwt = require('jsonwebtoken')
const Usuario = require('../models/Usuario')

// Middleware para validar token JWT
const validarAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        exito: false,
        mensaje: 'No hay token, acceso denegado'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto-temporal')
    const usuario = await Usuario.findById(decoded.id)
    
    if (!usuario || !usuario.activo) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token no válido'
      })
    }

    req.usuario = usuario
    next()
  } catch (error) {
    console.error('Error en validación de token:', error)
    res.status(401).json({
      exito: false,
      mensaje: 'Token no válido'
    })
  }
}

// Middleware para validar que el usuario sea administrador
const validarAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      exito: false,
      mensaje: 'Acceso denegado. Se requieren permisos de administrador'
    })
  }
  next()
}

module.exports = {
  validarAuth,
  validarAdmin
}