import mongoose from 'mongoose';

const pedidoSchema = new mongoose.Schema({
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
        }
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    estado: {
        type: String,
        enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente'
    },
    direccionEnvio: {
        nombre: { type: String, required: true },
        direccion: { type: String, required: true },
        ciudad: { type: String, required: true },
        codigoPostal: { type: String, required: true },
        telefono: { type: String, required: true }
    },
    metodoPago: {
        type: String,
        enum: ['efectivo', 'tarjeta', 'transferencia', 'mercadopago'],
        required: true
    },
    fechaEntregaEstimada: {
        type: Date
    }
}, {
    timestamps: true
})

// Middleware para actualizar el historial de pedidos del usuario después de guardar
pedidoSchema.post('save', async function(doc) {
    try {
        // Importar el método del controlador para actualizar el usuario
        const { agregarPedidoUsuario } = await import('../controllers/authController.js');
        
        // Agregar el pedido al historial del usuario
        if (doc.usuario) {
            // Necesitamos poblar los productos para tener la información completa
            const pedidoCompleto = await mongoose.model('Pedido').findById(doc._id).populate('productos.producto');
            await agregarPedidoUsuario(doc.usuario, pedidoCompleto);
        }
    } catch (error) {
        console.error('Error al actualizar historial de pedidos del usuario:', error);
    }
});

export default mongoose.model('Pedido', pedidoSchema)
