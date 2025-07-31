const express = require('express')
const Producto = require('../models/Producto')
const { validarAuth, validarAdmin } = require('../middleware/auth')

const router = express.Router()

// Obtener todos los productos (público)
router.get('/', async (req, res) => {
  try {
    const { categoria, destacado, limite } = req.query
    
    let filtros = { activo: true }
    
    if (categoria && categoria !== 'Todos') {
      filtros.categoria = categoria
    }
    
    if (destacado === 'true') {
      filtros.destacado = true
    }

    let consulta = Producto.find(filtros).sort({ fechaCreacion: -1 })
    
    if (limite) {
      consulta = consulta.limit(parseInt(limite))
    }

    const productos = await consulta
    
    res.json({
      exito: true,
      productos,
      total: productos.length
    })

  } catch (error) {
    console.error('Error obteniendo productos:', error)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    })
  }
})

// Obtener producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
    
    if (!producto || !producto.activo) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      })
    }

    res.json({
      exito: true,
      producto
    })

  } catch (error) {
    console.error('Error obteniendo producto:', error)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    })
  }
})

// Crear producto (solo admin)
router.post('/', validarAuth, validarAdmin, async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body)
    await nuevoProducto.save()

    res.status(201).json({
      exito: true,
      mensaje: 'Producto creado exitosamente',
      producto: nuevoProducto
    })

  } catch (error) {
    console.error('Error creando producto:', error)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    })
  }
})

// Actualizar producto (solo admin)
router.put('/:id', validarAuth, validarAdmin, async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    if (!producto) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      })
    }

    res.json({
      exito: true,
      mensaje: 'Producto actualizado exitosamente',
      producto
    })

  } catch (error) {
    console.error('Error actualizando producto:', error)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor',
      error: error.message
    })
  }
})

// Eliminar producto (solo admin)
router.delete('/:id', validarAuth, validarAdmin, async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    )

    if (!producto) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      })
    }

    res.json({
      exito: true,
      mensaje: 'Producto eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error eliminando producto:', error)
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    })
  }
})

module.exports = router