import { createContext, useContext, useEffect, useState } from 'react'
import { serviciosAuth } from '../services/api'

// Crear el contexto
const AuthContext = createContext()

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return contexto
}

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Verificar si hay un usuario logueado al cargar la app
  useEffect(() => {
    verificarUsuarioLogueado()
  }, [])

  const verificarUsuarioLogueado = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const respuesta = await serviciosAuth.obtenerPerfil()
        if (respuesta.exito) {
          setUsuario(respuesta.usuario)
        }
      }
    } catch (error) {
      console.error('Error verificando usuario:', error)
      // Si el token es inválido, limpiarlo
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    } finally {
      setCargando(false)
    }
  }

  // Función para registrar usuario
  const registrar = async (datosUsuario) => {
    try {
      setError(null)
      setCargando(true)
      
      const respuesta = await serviciosAuth.registrar(datosUsuario)
      
      if (respuesta.exito) {
        // Guardar token y usuario
        localStorage.setItem('token', respuesta.token)
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario))
        setUsuario(respuesta.usuario)
        return { exito: true, mensaje: respuesta.mensaje }
      }
    } catch (error) {
      const mensajeError = error.message || 'Error al registrar usuario'
      setError(mensajeError)
      return { exito: false, mensaje: mensajeError }
    } finally {
      setCargando(false)
    }
  }

  // Función para iniciar sesión
  const iniciarSesion = async (credenciales) => {
    try {
      setError(null)
      setCargando(true)
      
      const respuesta = await serviciosAuth.iniciarSesion(credenciales)
      
      if (respuesta.exito) {
        // Guardar token y usuario
        localStorage.setItem('token', respuesta.token)
        localStorage.setItem('usuario', JSON.stringify(respuesta.usuario))
        setUsuario(respuesta.usuario)
        return { exito: true, mensaje: respuesta.mensaje }
      }
    } catch (error) {
      const mensajeError = error.message || 'Error al iniciar sesión'
      setError(mensajeError)
      return { exito: false, mensaje: mensajeError }
    } finally {
      setCargando(false)
    }
  }

  // Función para cerrar sesión
  const cerrarSesion = () => {
    serviciosAuth.cerrarSesion()
    setUsuario(null)
    setError(null)
  }

  // Verificar si el usuario es administrador
  const esAdmin = () => {
    return usuario && usuario.rol === 'admin'
  }

  // Verificar si el usuario está autenticado
  const estaAutenticado = () => {
    return !!usuario
  }

  const valor = {
    usuario,
    cargando,
    error,
    registrar,
    iniciarSesion,
    cerrarSesion,
    esAdmin,
    estaAutenticado,
    setError
  }

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  )
}