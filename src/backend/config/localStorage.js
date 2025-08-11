import fs from 'fs'
import multer from 'multer'
import path from 'path'

// RUTA ABSOLUTA al directorio public/imgs/products
const PRODUCT_IMAGES_DIR = path.join(process.cwd(), '../public/imgs/products')

// Asegurarse de que el directorio existe
if (!fs.existsSync(PRODUCT_IMAGES_DIR)) {
  fs.mkdirSync(PRODUCT_IMAGES_DIR, { recursive: true })
  console.log(`Directorio de productos creado: ${PRODUCT_IMAGES_DIR}`)
}

// Configurar almacenamiento local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, PRODUCT_IMAGES_DIR)
  },
  filename: function (req, file, cb) {
    // Usar el nombre del producto si está disponible, o un timestamp
    const nombreBase = req.body.nombre 
      ? req.body.nombre
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')  // Reemplazar espacios con guiones
        .replace(/[áéíóúüñ]/g, match => {
          const chars = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ü': 'u', 'ñ': 'n' }
          return chars[match] || match
        })
        .replace(/[^a-z0-9-]/g, '')  // Eliminar caracteres no alfanuméricos excepto guiones
      : `producto-${Date.now()}`
    
    // Obtener la extensión del archivo original
    const extension = path.extname(file.originalname).toLowerCase() || '.webp'
    
    // Nombre final del archivo
    const nombreArchivo = `${nombreBase}${extension}`
    
    console.log(`Guardando imagen como: ${nombreArchivo}`)
    cb(null, nombreArchivo)
  }
})

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Formato de imagen no válido. Sólo se permiten JPG, PNG y WEBP'), false)
  }
}

// Límites de archivo
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
}

// Configuración de multer
const upload = multer({ 
  storage, 
  fileFilter,
  limits
})

export default upload
