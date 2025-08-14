import mongoose from 'mongoose'

const CATEGORIAS_VALIDAS = [
    'Frutos Secos', 'Semillas', 'Harinas y Repostería', 
    'Legumbres', 'Cereales', 'Suplementos', 'Bebidas', 
    'Snacks Saludables', 'Aceites y Aderezos', 'Lácteos Vegetales',
    'Endulzantes Naturales', 'Condimentos y Especias', 'Otros'
]

const TAGS_VALIDOS = [
    'Sin TACC', 'Vegano', 'Orgánico', 'Light', 'Fuente de Fibra', 
    'Proteico', 'Sin Azúcar Agregada', 'Bajo en Sodio', 'Keto', 
    'Sin Lactosa', 'Crudo', 'Tostado', 'Sin Sal', 'Integral', 
    'Libre de Gluten'
]

const productoSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'], 
        trim: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
    },
    
    descripcion: { 
        type: String, 
        required: [true, 'La descripción es obligatoria'],
        minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
        maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
    },
    
    // SISTEMA DE PRECIOS Y MEDIDAS
    tipoVenta: {
        type: String,
        enum: ['unidad', 'peso_variable', 'peso_fijo'],
        required: true,
        default: 'peso_fijo'
    },
    
    // Para productos por unidad (ej: suplementos, bebidas)
    precioUnidad: {
        type: Number,
        min: [1, 'El precio debe ser mayor a 0']
    },
    
    // Para productos por peso variable (granel)
    precioGramo: {
        type: Number,
        min: [1, 'El precio por gramo debe ser mayor a 0']
    },
    
    // Para productos con peso fijo
    pesoEnvase: {
        cantidad: { type: Number }, // 500, 1000, etc.
        unidad: { 
            type: String, 
            enum: ['g', 'kg', 'ml', 'l', 'unidad'],
            default: 'g'
        }
    },
    
    // Rangos para venta a granel
    ventaGranel: {
        pesoMinimo: { type: Number, default: 100 }, // 100g
        pesoMaximo: { type: Number, default: 5000 }, // 5kg
        incremento: { type: Number, default: 50 } // de 50g en 50g
    },
    
    // STOCK UNIFICADO
    stock: {
        cantidad: { type: Number, required: true, min: 0, default: 0 },
        unidadStock: { 
            type: String,
            enum: ['unidades', 'gramos', 'kilogramos', 'mililitros', 'litros'],
            required: true,
            default: 'gramos'
        },
        stockMinimo: { type: Number, default: 5 },
        disponible: { type: Boolean, default: true }
    },
    
    imagen: { type: String },
    
    categoria: { 
        type: String, 
        required: [true, 'La categoría es obligatoria'], 
        enum: {
            values: CATEGORIAS_VALIDAS,
            message: '{VALUE} no es una categoría válida'
        }
    },
    
    tags: [{ 
        type: String,
        enum: {
            values: TAGS_VALIDOS,
            message: 'El tag {VALUE} no es válido'
        }
    }],
    
    // INFORMACIÓN NUTRICIONAL
    informacionNutricional: {
        calorias: Number,
        proteinas: Number,
        carbohidratos: Number,
        grasas: Number,
        fibra: Number,
        sodio: Number
    },
    
    // SEO y búsqueda
    slug: {
        type: String,
        unique: true
    },
    
    activo: {
        type: Boolean,
        default: true
    }
    
}, {
    timestamps: true
})

// Índices para mejorar búsquedas
productoSchema.index({ nombre: 'text', descripcion: 'text' })
productoSchema.index({ categoria: 1 })
productoSchema.index({ tags: 1 })
productoSchema.index({ activo: 1, 'stock.disponible': 1 })
productoSchema.index({ slug: 1 }) // Índice para búsquedas por slug

// Método para calcular precio según cantidad
productoSchema.methods.calcularPrecio = function(cantidad, unidad = 'g') {
    if (this.tipoVenta === 'unidad') {
        return this.precioUnidad * cantidad
    } else if (this.tipoVenta === 'peso_variable') {
        const cantidadEnGramos = unidad === 'kg' ? cantidad * 1000 : cantidad
        return this.precioGramo * cantidadEnGramos
    } else {
        // peso_fijo - precio por envase
        return this.precioUnidad * cantidad
    }
}

// Método para verificar stock disponible
productoSchema.methods.verificarStock = function(cantidadSolicitada, unidadSolicitada = 'g') {
    if (!this.stock.disponible) return false
    
    let cantidadEnUnidadStock
    
    if (this.stock.unidadStock === 'gramos') {
        cantidadEnUnidadStock = unidadSolicitada === 'kg' ? cantidadSolicitada * 1000 : cantidadSolicitada
    } else {
        cantidadEnUnidadStock = cantidadSolicitada
    }
    
    return this.stock.cantidad >= cantidadEnUnidadStock
}

// Pre-save hook para generar slug (url con descripcion entendible)
productoSchema.pre('save', function(next) {
    if (this.isModified('nombre')) {
        this.slug = this.nombre
            .toLowerCase()
            .replace(/[áéíóú]/g, a => 'aeiou'['áéíóú'.indexOf(a)])
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
    }
    next()
})

productoSchema.statics.categoriasValidas = () => CATEGORIAS_VALIDAS
productoSchema.statics.tagsValidos = () => TAGS_VALIDOS

export default mongoose.model('Producto', productoSchema)