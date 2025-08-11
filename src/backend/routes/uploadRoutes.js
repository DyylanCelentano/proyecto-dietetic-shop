// backend/routes/uploadRoutes.js
import express from 'express'
import upload from '../config/localStorage.js'
import { esAdmin, verificarToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// Ruta: POST /api/upload - Para subir imágenes de productos
router.post('/', [verificarToken, esAdmin], (req, res) => {
    upload.single('imagen')(req, res, function (err) {
        if (err) {
            console.error('Error al subir imagen:', err)
            return res.status(400).json({ message: err.message })
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo.' })
        }

        // Construir la ruta relativa para guardar en la BD (sin 'public/')
        const relativePath = `imgs/products/${req.file.filename}`
        
        res.status(201).json({
            message: 'Imagen subida exitosamente',
            imageUrl: relativePath,
            fileName: req.file.filename
        })
    })
})

export default router
    