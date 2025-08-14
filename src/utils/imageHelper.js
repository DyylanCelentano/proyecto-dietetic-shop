/**
 * Funciones de utilidad para trabajar con imágenes locales en el proyecto
 */

/**
 * Obtiene la URL correcta para una imagen de producto
 * Recibe la ruta de la imagen guardada en la base de datos
 * Devuelve la URL completa para usar en el componente <img>
 */
export const getProductImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/imgs/icons/placeholder.svg'
  }
  
  // Si ya es una URL completa (http o https), la devolvemos como está
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Si empieza con "/", devolvemos la ruta como está
  if (imagePath.startsWith('/')) {
    return imagePath
  }
  
  // Para rutas relativas de productos, asumimos que están en /imgs/products
  if (!imagePath.includes('/')) {
    return `/imgs/products/${imagePath}`
  }
  
  // Si no, devolvemos la ruta con "/" al inicio
  return `/${imagePath}`
}

/**
 * Extrae el nombre del archivo de imagen de una ruta completa
 * Recibe La ruta de la imagen
 * Devuelve el nombre del archivo sin extensión, o null si no es válido
 */
export const extractImageFileName = (imagePath) => {
  if (!imagePath) return null
  
  // Obtener solo el nombre del archivo sin la ruta
  const parts = imagePath.split('/')
  const fileName = parts[parts.length - 1]
  
  // Quitar la extensión
  if (fileName.includes('.')) {
    return fileName.split('.')[0]
  }
  
  return fileName
}

/**
 * Genera una ruta de imagen en el formato correcto para almacenar en la base de datos
 * Recibe el nombre del archivo con extensión
 * Devuelve la ruta relativa para guardar en la base de datos
 */

export const formatImagePathForDatabase = (fileName) => {
  if (!fileName) return null
  
  // Eliminamos public/ si existe
  const cleanPath = fileName.replace(/^public\/?/i, '')
  
  // Aseguramos que la ruta comience con imgs/products/
  if (!cleanPath.startsWith('imgs/products/')) {
    return `imgs/products/${cleanPath}`
  }
  
  return cleanPath
}
