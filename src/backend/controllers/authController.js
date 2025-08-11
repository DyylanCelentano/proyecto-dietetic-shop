import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import Usuario from '../models/Usuario.js'

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
  )
}

// Registrar nuevo usuario
const registrarUsuario = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({
      $or: [{ email }, { username }]
    })

    if (usuarioExistente) {
      if (usuarioExistente.email === email) {
        return res.status(400).json({
          exito: false,
          mensaje: 'Este email ya está registrado'
        })
      }
      if (usuarioExistente.username === username) {
        return res.status(400).json({
          exito: false,
          mensaje: 'Este nombre de usuario ya está en uso'
        })
      }
    }

    // Extraer campos adicionales, si están disponibles
    const { nombre, apellido, telefono, direccion } = req.body

    // Crear nuevo usuario con todos los campos disponibles
    const nuevoUsuario = new Usuario({
      username,
      email,
      password,
      nombre: nombre || '',
      apellido: apellido || '',
      telefono: telefono || '',
      direccion: {
        calle: direccion?.calle || '',
        numero: direccion?.numero || '',
        piso: direccion?.piso || '',
        departamento: direccion?.departamento || '',
        ciudad: direccion?.ciudad || '',
        provincia: direccion?.provincia || '',
        codigoPostal: direccion?.codigoPostal || ''
      }
    })

    await nuevoUsuario.save()

    // Generar token
    const token = generarToken(nuevoUsuario)

    res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado exitosamente',
      usuario: nuevoUsuario,
      token
    })

  } catch (error) {
    console.error('Error al registrar usuario:', error)
    
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        exito: false,
        mensaje: 'Error de validación',
        errores
      })
    }

    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    })
  }
}

// Iniciar sesión
const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales incorrectas'
      })
    }

    // Verificar si el usuario está activo (si no tiene el campo activo, se considera activo)
    if (usuario.activo === false) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Tu cuenta ha sido desactivada'
      })
    }

    // Verificar contraseña
    const passwordValida = await usuario.compararPassword(password)
    
    if (!passwordValida) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales incorrectas'
      })
    }

    // Generar token
    const token = generarToken(usuario)

    res.json({
      exito: true,
      mensaje: 'Sesión iniciada exitosamente',
      usuario,
      token
    })

  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    })
  }
}

// Obtener perfil del usuario actual
const obtenerPerfil = async (req, res) => {
  try {
    console.log('Obteniendo perfil para usuario:', req.usuario);
    const usuario = await Usuario.findById(req.usuario._id)
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      })
    }

    res.json({
      exito: true,
      usuario
    })

  } catch (error) {
    console.error('Error al obtener perfil:', error)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    })
  }
}

// Middleware para verificar token
const verificarToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token no proporcionado'
      })
    }

    const decoded = jwt.verify(token, config.jwtSecret)
    const usuario = await Usuario.findById(decoded.id)

    if (!usuario || usuario.activo === false) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token inválido'
      })
    }

    req.usuario = usuario
    next()

  } catch (error) {
    console.error('Error al verificar token:', error)
    res.status(401).json({
      exito: false,
      mensaje: 'Token inválido'
    })
  }
}

// Actualizar perfil del usuario
const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, apellido, telefono, direccion } = req.body;
    
    // Buscar el usuario por ID
    const usuario = await Usuario.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }
    
    // Actualizar campos si fueron proporcionados
    if (nombre !== undefined) usuario.nombre = nombre;
    if (apellido !== undefined) usuario.apellido = apellido;
    if (telefono !== undefined) usuario.telefono = telefono;
    
    // Actualizar dirección si se proporcionó
    if (direccion) {
      usuario.direccion = {
        ...usuario.direccion || {},
        ...direccion
      };
    }
    
    await usuario.save();
    
    res.json({
      exito: true,
      mensaje: 'Perfil actualizado exitosamente',
      usuario
    });
    
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Agregar pedido al historial del usuario
const agregarPedidoUsuario = async (usuarioId, pedido) => {
  try {
    const usuario = await Usuario.findById(usuarioId);
    
    if (!usuario) {
      console.error('Usuario no encontrado al agregar pedido:', usuarioId);
      return false;
    }
    
    // Crear un resumen del pedido para guardar en el usuario
    const resumenPedido = {
      pedidoId: pedido._id,
      fecha: pedido.createdAt || new Date(),
      productos: pedido.productos.map(item => ({
        nombre: item.producto.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
        imagen: item.producto.imagen
      })),
      total: pedido.total,
      estado: pedido.estado
    };
    
    // Agregar el pedido al historial del usuario
    usuario.pedidos.push(resumenPedido);
    await usuario.save();
    
    return true;
  } catch (error) {
    console.error('Error al agregar pedido al usuario:', error);
    return false;
  }
};

// Cambiar contraseña
const cambiarPassword = async (req, res) => {
  try {
    console.log('Solicitud de cambio de contraseña recibida:', { 
      body: req.body,
      usuarioToken: {
        _id: req.usuario._id,
        rol: req.usuario.rol
      }
    });
    
    const { usuarioId, passwordActual, passwordNuevo } = req.body
    
    // Verificar que el ID del usuario corresponda con el token
    const tokenId = req.usuario._id.toString();
    console.log('Verificación de autorización:', { 
      tokenId, 
      usuarioId, 
      rol: req.usuario.rol,
      coinciden: tokenId === usuarioId,
      esAdmin: req.usuario.rol === 'admin'
    });
    
    if (tokenId !== usuarioId && req.usuario.rol !== 'admin') {
      return res.status(401).json({
        exito: false,
        mensaje: 'No autorizado para cambiar esta contraseña'
      });
    }
    
    // Buscar el usuario
    const usuario = await Usuario.findById(usuarioId)
    if (!usuario) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      })
    }
    
    // Verificar contraseña actual
    const passwordCorrecto = await bcryptjs.compare(passwordActual, usuario.password)
    if (!passwordCorrecto) {
      return res.status(400).json({
        exito: false,
        mensaje: 'La contraseña actual es incorrecta'
      })
    }
    
    // Validar nueva contraseña con todos los requisitos
    const errores = [];
    const cumpleRequisitos = {
      longitud: passwordNuevo.length >= 8,
      mayuscula: /[A-Z]/.test(passwordNuevo),
      minuscula: /[a-z]/.test(passwordNuevo),
      numero: /\d/.test(passwordNuevo)
    };
    
    if (!cumpleRequisitos.longitud) {
      errores.push('al menos 8 caracteres');
    }
    
    if (!cumpleRequisitos.mayuscula) {
      errores.push('al menos una letra mayúscula');
    }
    
    if (!cumpleRequisitos.minuscula) {
      errores.push('al menos una letra minúscula');
    }
    
    if (!cumpleRequisitos.numero) {
      errores.push('al menos un número');
    }
    
    if (errores.length > 0) {
      return res.status(400).json({
        exito: false,
        mensaje: `La contraseña debe tener ${errores.join(', ')}`,
        errores: errores,
        validacion: cumpleRequisitos
      });
    }
    
    // Hashear nueva contraseña
    const salt = await bcryptjs.genSalt(10)
    const passwordHash = await bcryptjs.hash(passwordNuevo, salt)
    
    // Actualizar directamente el campo de contraseña para evitar validaciones
    await Usuario.updateOne(
      { _id: usuarioId },
      { $set: { password: passwordHash } }
    )
    
    return res.status(200).json({
      exito: true,
      mensaje: 'Contraseña actualizada correctamente'
    })
    
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    
    // Manejo de errores específicos de MongoDB
    if (error.name === 'CastError') {
      return res.status(400).json({
        exito: false,
        mensaje: 'ID de usuario inválido',
        error: 'ID de formato incorrecto'
      });
    }
    
    // Error de validación de Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        exito: false,
        mensaje: 'Error de validación: ' + Object.values(error.errors).map(e => e.message).join(', '),
        error: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    // Error de MongoDB
    if (error.code && error.code.toString().startsWith('11')) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Error de base de datos: valor duplicado',
        error: error.message
      });
    }
    
    // Error genérico
    return res.status(500).json({
      exito: false,
      mensaje: 'Error al cambiar la contraseña: ' + error.message,
      error: error.message || 'Error interno del servidor'
    });
  }
}

export {
  actualizarPerfil,
  agregarPedidoUsuario,
  cambiarPassword,
  iniciarSesion,
  obtenerPerfil,
  registrarUsuario,
  verificarToken
}

