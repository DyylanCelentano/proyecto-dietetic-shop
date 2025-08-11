import fs from 'fs'
import multer from 'multer'
import path from 'path'

// Asegurarse de que el directorio de destino existe
const createDestinationDir = (dir) => {
  // Comprobar si el directorio ya existe
  if (!fs.existsSync(dir)) {
    // Si no existe, lo creamos recursivamente
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Crear directorio para las imágenes de productos si no existe
const productImageDir = path.join(process.cwd(), '../public/imgs/products')
createDestinationDir(productImageDir)

// Configurar almacenamiento local
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productImageDir)
  },
  filename: function (req, file, cb) {
    // Obtener el nombre del producto del cuerpo de la petición
    const productoNombre = req.body.nombre || 'producto'
    
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
    const extension = path.extname(file.originalname) || '.webp'
    
    // Crear el nombre final del archivo
    const timestamp = Date.now()
    const nombreArchivo = `${nombreBase}-${timestamp}${extension}`
    
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

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
}

// Crear middleware de Multer
const uploadLocal = multer({ 
  storage, 
  fileFilter,
  limits
})

export default uploadLocal
