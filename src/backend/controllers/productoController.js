// controllers/productoController.js
const Producto = require('../models/Producto');

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find({});
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error en el servidor' });
    }
};

// Obtener un solo producto por ID
const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }   
        
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error en el servidor' });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
};