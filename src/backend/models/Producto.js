// models/Producto.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    peso: { type: String, required: true }, // Ej: "250g", "1kg"
    imagen: { type: String, required: true }, // URL de la imagen
    categoria: { type: String, required: true, trim: true }, // Ej: "Frutos Secos", "Legumbres"
    tags: [{ type: String }] // Ej: ["sin tacc", "organico", "vegano"]
}, {
    timestamps: true // Crea createdAt y updatedAt automáticamente
});

const Producto = mongoose.model('Producto', productoSchema);
module.exports = Producto;