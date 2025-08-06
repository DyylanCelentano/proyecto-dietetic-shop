import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import Usuario from '../models/Usuario.js';

// Función para generar JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario._id, 
      email: usuario.email, 
      rol: usuario.rol 
    },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};

// Registrar nuevo usuario
const registrarUsuario = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({
      $or: [{ email }, { username }]
    });

    if (usuarioExistente) {
      if (usuarioExistente.email === email) {
        return res.status(400).json({
          exito: false,
          mensaje: 'Este email ya está registrado'
        });
      }
      if (usuarioExistente.username === username) {
        return res.status(400).json({
          exito: false,
          mensaje: 'Este nombre de usuario ya está en uso'
        });
      }
    }

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      username,
      email,
      password
    });

    await nuevoUsuario.save();

    // Generar token
    const token = generarToken(nuevoUsuario);

    res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario,
      token
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        exito: false,
        mensaje: 'Error de validación',
        errores
      });
    }

    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Iniciar sesión
const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    // Verificar si el usuario está activo (si no tiene el campo activo, se considera activo)
    if (usuario.activo === false) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Tu cuenta ha sido desactivada'
      });
    }

    // Verificar contraseña
    const passwordValida = await usuario.compararPassword(password);
    
    if (!passwordValida) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales incorrectas'
      });
    }

    // Generar token
    const token = generarToken(usuario);

    res.json({
      exito: true,
      mensaje: 'Sesión iniciada exitosamente',
      usuario,
      token
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener perfil del usuario actual
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      exito: true,
      usuario
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Middleware para verificar token
const verificarToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario || usuario.activo === false) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido'
      });
    }

    req.usuario = usuario;
    next();

  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(401).json({
      exito: false,
      mensaje: 'Token inválido'
    });
  }
};

export {
    iniciarSesion,
    obtenerPerfil, registrarUsuario, verificarToken
};
