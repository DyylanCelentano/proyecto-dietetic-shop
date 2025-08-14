import mongoose from 'mongoose'
import Producto from '../models/Producto.js'

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const filtro = {}

        // Si llega una categoría en la consulta, la añadimos al filtro.
        if (req.query.categoria) {
            filtro.categoria = req.query.categoria
        }

        // Si llegan tags (como un string separado por comas), los añadimos.
        if (req.query.tags) {
            // El operador $all de MongoDB busca documentos donde el campo 'tags'
            // contenga TODOS los elementos del array que le pasamos.
            filtro.tags = { $all: req.query.tags.split(',') }
        }

        const productos = await Producto.find(filtro).sort({ createdAt: -1 })
        res.json(productos)
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error en el servidor' })
    }
}


// Obtener un solo producto por ID o slug
const obtenerProductoPorId = async (req, res) => {
    try {
        // Verificar si el parámetro parece un ObjectId válido de MongoDB
        const esObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        
        let producto;
        
        if (esObjectId) {
            // Si es un ObjectId válido, buscar por _id
            producto = await Producto.findById(req.params.id);
        } else {
            // Si no es un ObjectId, asumimos que es un slug (nombre amigable para URL)
            // Convertimos el slug a un nombre de producto aproximado
            const nombrePosible = req.params.id
                .replace(/-/g, ' ')  // Reemplazar guiones por espacios
                .replace(/\b\w/g, l => l.toUpperCase());  // Capitalizar primera letra de cada palabra
            
            // Buscar productos cuyo nombre contenga la cadena generada desde el slug
            // Usamos una expresión regular para hacer la búsqueda insensible a mayúsculas/minúsculas
            producto = await Producto.findOne({ 
                nombre: { $regex: new RegExp(nombrePosible, 'i') } 
            });
            
            console.log(`Buscando producto con nombre similar a: ${nombrePosible}`);
        }
        
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        res.json(producto);
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ message: 'Hubo un error en el servidor', error: error.message });
    }
}

// Nueva función para obtener la lista de categorías permitidas
const obtenerCategorias = (req, res) => {
    try {
        // Obtenemos las categorías directamente del modelo
        const categorias = Producto.schema.path('categoria').enumValues
        res.json(categorias)
    } catch (error) {
        console.error('Error al obtener categorías:', error)
        res.status(500).json({ message: 'Error al obtener las categorías' })
    }
}

// Nueva función para obtener la lista de tags permitidos
const obtenerTags = (req, res) => {
    try {
        // Obtenemos los tags directamente del modelo
        const tags = Producto.schema.path('tags').caster.enumValues
        res.json(tags)
    } catch (error) {
        console.error('Error al obtener tags:', error)
        res.status(500).json({ message: 'Error al obtener los tags' })
    }
}

// Crear un nuevo producto (Solo Admin)
const crearProducto = async (req, res) => {
    try {
        // El req.body debe contener todos los campos del modelo Producto
        const nuevoProducto = new Producto(req.body)
        await nuevoProducto.save()
        res.status(201).json({
            mensaje: 'Producto creado exitosamente',
            producto: nuevoProducto
        })
    } catch (error) {
        console.error('Error al crear producto:', error)
        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const errores = {}
            Object.keys(error.errors).forEach(key => {
                errores[key] = error.errors[key].message
            })
            return res.status(400).json({ 
                message: 'Error de validación',
                errores 
            })
        }
        res.status(500).json({ message: 'Error al crear el producto' })
    }
}

// Actualizar un producto existente (Solo Admin)
const actualizarProducto = async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
        if (!productoActualizado) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        res.json({
            mensaje: 'Producto actualizado exitosamente',
            producto: productoActualizado
        })
    } catch (error) {
        console.error('Error al actualizar producto:', error)
        res.status(500).json({ message: 'Error al actualizar el producto' })
    }
}

// Eliminar un producto (Solo Admin)
const eliminarProducto = async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id)
        if (!productoEliminado) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        res.json({ message: 'Producto eliminado exitosamente' })
    } catch (error) {
        console.error('Error al eliminar producto:', error)
        res.status(500).json({ message: 'Error al eliminar el producto' })
    }
}

// Actualizar slugs para productos existentes (temporal/utilidad)
const actualizarSlugs = async (req, res) => {
    try {
        // Obtener todos los productos
        const productos = await Producto.find({})
        
        // Array para almacenar resultados
        const resultados = []
        
        // Recorrer cada producto y actualizar su slug
        for (const producto of productos) {
            // Crear slug a partir del nombre
            const slug = producto.nombre
                .toLowerCase()
                .replace(/\s+/g, '-')     // Reemplazar espacios por guiones
                .replace(/[^\w-]+/g, '')  // Eliminar caracteres especiales
            
            // Actualizar el producto con el slug
            producto.slug = slug
            await producto.save()
            
            // Guardar el resultado
            resultados.push({
                id: producto._id,
                nombre: producto.nombre,
                slug: slug
            })
        }
        
        res.json({
            mensaje: `${resultados.length} productos actualizados con slugs`,
            resultados
        })
    } catch (error) {
        console.error('Error actualizando slugs:', error)
        res.status(500).json({ message: 'Error al actualizar los slugs de productos' })
    }
}

export {
    actualizarProducto, actualizarSlugs, crearProducto, eliminarProducto,
    obtenerCategorias, obtenerProductoPorId, obtenerProductos, obtenerTags
}

