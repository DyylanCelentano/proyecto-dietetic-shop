export const validarProducto = (datos) => {
  const errores = {}

  // Validación del nombre
  if (!datos.nombre || datos.nombre.trim() === '') {
    errores.nombre = 'El nombre es obligatorio'
  } else if (datos.nombre.trim().length < 3) {
    errores.nombre = 'El nombre debe tener al menos 3 caracteres'
  } else if (datos.nombre.trim().length > 100) {
    errores.nombre = 'El nombre no puede exceder los 100 caracteres'
  } else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_.,()]+$/.test(datos.nombre.trim())) {
    errores.nombre = 'El nombre contiene caracteres no permitidos'
  }

  // Validación del precio
  if (!datos.precio || datos.precio === '') {
    errores.precio = 'El precio es obligatorio'
  } else if (isNaN(datos.precio)) {
    errores.precio = 'El precio debe ser un número válido'
  } else if (Number(datos.precio) <= 0) {
    errores.precio = 'El precio debe ser mayor a 0'
  } else if (Number(datos.precio) > 999999) {
    errores.precio = 'El precio no puede exceder 999,999'
  }

  // Validación del peso
  if (!datos.peso || datos.peso === '') {
    errores.peso = 'El peso es obligatorio'
  } else if (isNaN(datos.peso)) {
    errores.peso = 'El peso debe ser un número válido'
  } else if (Number(datos.peso) <= 0) {
    errores.peso = 'El peso debe ser mayor a 0'
  } else if (Number(datos.peso) > 99999) {
    errores.peso = 'El peso no puede exceder 99,999g'
  }

  // Validación de la categoría
  if (!datos.categoria || datos.categoria === '') {
    errores.categoria = 'La categoría es obligatoria'
  }

  // Validación de la descripción
  if (!datos.descripcion || datos.descripcion.trim() === '') {
    errores.descripcion = 'La descripción es obligatoria'
  } else if (datos.descripcion.trim().length < 10) {
    errores.descripcion = 'La descripción debe tener al menos 10 caracteres'
  } else if (datos.descripcion.trim().length > 200) {
    errores.descripcion = 'La descripción no puede exceder los 200 caracteres'
  }

  return errores
}

// Validación específica para el nombre (para validación en tiempo real)
export const validarNombre = (nombre) => {
  if (!nombre || nombre.trim() === '') {
    return 'El nombre es obligatorio'
  }
  if (nombre.trim().length < 3) {
    return 'El nombre debe tener al menos 3 caracteres'
  }
  if (nombre.trim().length > 100) {
    return 'El nombre no puede exceder los 100 caracteres'
  }
  if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-_.,()]+$/.test(nombre.trim())) {
    return 'El nombre contiene caracteres no permitidos'
  }
  return ''
}

// Validación específica para el precio (para validación en tiempo real)
export const validarPrecio = (precio) => {
  if (!precio || precio === '') {
    return 'El precio es obligatorio'
  }
  if (isNaN(precio)) {
    return 'El precio debe ser un número válido'
  }
  if (Number(precio) <= 0) {
    return 'El precio debe ser mayor a 0'
  }
  if (Number(precio) > 999999) {
    return 'El precio no puede exceder 999,999'
  }
  return ''
}

// Validación específica para el peso (para validación en tiempo real)
export const validarPeso = (peso) => {
  if (!peso || peso === '') {
    return 'El peso es obligatorio'
  }
  if (isNaN(peso)) {
    return 'El peso debe ser un número válido'
  }
  if (Number(peso) <= 0) {
    return 'El peso debe ser mayor a 0'
  }
  if (Number(peso) > 99999) {
    return 'El peso no puede exceder 99,999g'
  }
  return ''
}

// Validación específica para la descripción (para validación en tiempo real)
export const validarDescripcion = (descripcion) => {
  if (!descripcion || descripcion.trim() === '') {
    return 'La descripción es obligatoria'
  }
  
  const descripcionTrim = descripcion.trim()
  
  if (descripcionTrim.length < 10) {
    return 'La descripción debe tener al menos 10 caracteres'
  }
  
  if (descripcionTrim.length > 200) {
    return 'La descripción no puede exceder los 200 caracteres'
  }
  
  return ''
} 