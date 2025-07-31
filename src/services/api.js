// Configuración base para las llamadas a la API
const API_BASE_URL = 'http://localhost:5000/api'

// Función helper para hacer peticiones HTTP
const hacerPeticion = async (endpoint, opciones = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...opciones.headers
      },
      ...opciones
    }

    // Agregar token si existe
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    const respuesta = await fetch(url, config)
    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'Error en la petición')
    }

    return datos
  } catch (error) {
    console.error('Error en petición API:', error)
    throw error
  }
}

// Servicios de autenticación
export const serviciosAuth = {
  // Registrar nuevo usuario
  registrar: async (datosUsuario) => {
    return await hacerPeticion('/auth/registro', {
      method: 'POST',
      body: JSON.stringify({
        nombre: datosUsuario.firstName,
        apellido: datosUsuario.lastName,
        email: datosUsuario.email,
        password: datosUsuario.password
      })
    })
  },

  // Iniciar sesión
  iniciarSesion: async (credenciales) => {
    return await hacerPeticion('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credenciales)
    })
  },

  // Obtener perfil del usuario
  obtenerPerfil: async () => {
    return await hacerPeticion('/auth/perfil')
  },

  // Cerrar sesión (limpiar token local)
  cerrarSesion: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }
}

// Servicios de productos
export const serviciosProductos = {
  // Obtener todos los productos
  obtenerTodos: async (filtros = {}) => {
    const params = new URLSearchParams()
    
    if (filtros.categoria) params.append('categoria', filtros.categoria)
    if (filtros.destacado) params.append('destacado', filtros.destacado)
    if (filtros.limite) params.append('limite', filtros.limite)

    const query = params.toString() ? `?${params.toString()}` : ''
    return await hacerPeticion(`/products${query}`)
  },

  // Obtener producto por ID
  obtenerPorId: async (id) => {
    return await hacerPeticion(`/products/${id}`)
  },

  // Crear producto (solo admin)
  crear: async (datosProducto) => {
    return await hacerPeticion('/products', {
      method: 'POST',
      body: JSON.stringify(datosProducto)
    })
  },

  // Actualizar producto (solo admin)
  actualizar: async (id, datosProducto) => {
    return await hacerPeticion(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datosProducto)
    })
  },

  // Eliminar producto (solo admin)
  eliminar: async (id) => {
    return await hacerPeticion(`/products/${id}`, {
      method: 'DELETE'
    })
  }
}