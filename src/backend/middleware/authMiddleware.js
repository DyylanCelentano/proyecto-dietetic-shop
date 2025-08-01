const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const config = require('../config/config');

// Middleware para verificar token (el que ya tienes)
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

const esAdmin = (req, res, next) => {
    // Este middleware debe correr DESPUÉS de verificarToken
    if (req.usuario && req.usuario.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            exito: false,
            mensaje: 'Acceso denegado. Se requiere rol de administrador.' 
        });
    }
};

module.exports = { verificarToken, esAdmin };