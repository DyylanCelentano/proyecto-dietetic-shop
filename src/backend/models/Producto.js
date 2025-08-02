// models/Producto.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'], 
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_.,()]+$/.test(v);
            },
            message: 'El nombre contiene caracteres no permitidos'
        }
    },
    descripcion: { 
        type: String, 
        required: [true, 'La descripción es obligatoria'],
        minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
        maxlength: [200, 'La descripción no puede exceder los 200 caracteres']
    },
    precio: { 
        type: Number, 
        required: [true, 'El precio es obligatorio'],
        min: [0.01, 'El precio debe ser mayor a 0'],
        max: [999999, 'El precio no puede exceder 999,999']
    },
    peso: { 
        type: Number, 
        required: [true, 'El peso es obligatorio'],
        min: [1, 'El peso debe ser mayor a 0'],
        max: [99999, 'El peso no puede exceder 99,999g']
    }, // Peso en gramos
    imagen: { type: String }, // URL de la imagen
    categoria: { type: String, required: true, trim: true }, // Ej: "Frutos Secos", "Legumbres"
    tags: [{ type: String }] // Ej: ["sin tacc", "organico", "vegano"]
}, {
    timestamps: true // Crea createdAt y updatedAt automáticamente
});

const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;

