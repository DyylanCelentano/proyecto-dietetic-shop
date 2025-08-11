import fs from 'fs'
import path from 'path'

// RUTA ABSOLUTA al directorio public/imgs/products
const PRODUCT_IMAGES_DIR = path.join(process.cwd(), '../public/imgs/products')

// Middleware para verificar si el directorio de imágenes existe y crearlo si no
export const checkProductImagesDir = (req, res, next) => {
  try {
    // Asegurarse de que el directorio existe
    if (!fs.existsSync(PRODUCT_IMAGES_DIR)) {
      fs.mkdirSync(PRODUCT_IMAGES_DIR, { recursive: true })
      console.log(`Directorio creado: ${PRODUCT_IMAGES_DIR}`)
    }
    next()
  } catch (error) {
    console.error('Error al verificar/crear directorio de imágenes:', error)
    res.status(500).json({ message: 'Error de configuración del servidor' })
  }
}

// Middleware para normalizar el nombre de archivo basado en el nombre del producto
export const normalizeProductImageName = (req, res, next) => {
  if (!req.file) {
    return next()
  }

  try {
    // Si hay un nombre de producto en el cuerpo, lo usamos para el nombre del archivo
    if (req.body.nombre) {
      const productoNombre = req.body.nombre
      
      // Generar un nombre de archivo seguro basado en el nombre del producto
      const nombreBase = productoNombre
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')  // Reemplazar espacios con guiones
        .replace(/[áéíóúüñ]/g, match => {
          const chars = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n' }
          return chars[match] || match
        })
        .replace(/[^a-z0-9-]/g, '')  // Eliminar caracteres no alfanuméricos excepto guiones
      
      // Obtener la extensión del archivo original
      const extension = path.extname(req.file.originalname) || '.webp'
      
      // Nuevo nombre de archivo
      const newFilename = `${nombreBase}${extension}`
      
      // Ruta completa al nuevo archivo
      const newPath = path.join(PRODUCT_IMAGES_DIR, newFilename)
      
      // Renombrar el archivo subido
      fs.renameSync(req.file.path, newPath)
      
      // Actualizar información del archivo en el request
      req.file.filename = newFilename
      req.file.path = `imgs/products/${newFilename}`
    }

    next()
  } catch (error) {
    console.error('Error al normalizar nombre de imagen:', error)
    next()
  }
}
