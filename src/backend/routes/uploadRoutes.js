    // backend/routes/uploadRoutes.js
    const express = require('express');
    const multer = require('multer');
    const { storage } = require('../config/cloudinary');
    const { verificarToken, esAdmin } = require('../middleware/authMiddleware');
    
    const router = express.Router();
    const upload = multer({ storage });
    
    // Ruta: POST /api/upload
    // Protegida para que solo los admins puedan subir archivos.
    // 'upload.single('imagen')' le dice a Multer que esperamos un solo archivo
    // en un campo de formulario llamado 'imagen'.
    router.post('/', [verificarToken, esAdmin, upload.single('imagen')], (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: 'No se subió ningún archivo.' });
        }
        // Si el archivo se subió correctamente, Cloudinary nos da la URL en req.file.path
        res.status(201).json({
            message: 'Imagen subida exitosamente',
            imageUrl: req.file.path, // Esta es la URL segura de la imagen
        });
    });
    
    module.exports = router;
    