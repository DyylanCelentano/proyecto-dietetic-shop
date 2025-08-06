import mongoose from 'mongoose';

const ventaSchema = new mongoose.Schema({
    pedido: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pedido',
        required: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    productos: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Producto',
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1
        },
        precio: {
            type: Number,
            required: true,
            min: 0
        },
        categoria: String // Para analytics rápidos
    }],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    descuento: {
        type: Number,
        default: 0,
        min: 0
    },
    costoEnvio: {
        type: Number,
        default: 0,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    metodoPago: {
        type: String,
        enum: ['efectivo', 'tarjeta', 'transferencia', 'mercadopago'],
        required: true
    },
    fechaVenta: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índices para mejorar performance en consultas de analytics
ventaSchema.index({ fechaVenta: -1 });
ventaSchema.index({ usuario: 1 });
ventaSchema.index({ 'productos.categoria': 1 });

export default mongoose.model('Venta', ventaSchema);
