import axios from 'axios'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  // Función para verificar si estamos en modo demo
  const checkDemoMode = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL.replace('/api', '')}/demo-status`)
      return response.data.demoMode
    } catch (error) {
      return false
    }
  }

  // Función para auto-login en modo demo
  const autoLoginDemo = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/demo-login`)
      
      if (response.status === 200) {
        const data = response.data
        
        // Guardar el token y datos del usuario
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        localStorage.setItem('token', data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        
        // Actualizar el estado del usuario
        setUsuario(data.usuario)
        
        return data
      }
    } catch (error) {
      // Error silencioso
    }
    return null
  }

  useEffect(() => {
    const initializeApp = async () => {
      const usuarioGuardado = localStorage.getItem('usuario')
      const tokenGuardado = localStorage.getItem('token')
      
      if (usuarioGuardado && tokenGuardado) {
        try {
          // Configurar headers para verificación
          axios.defaults.headers.common['Authorization'] = `Bearer ${tokenGuardado}`
          
          // Intentar verificar el token existente
          try {
            await axios.get(`${import.meta.env.VITE_API_URL}/auth/verify`)
            setUsuario(JSON.parse(usuarioGuardado))
          } catch (verifyError) {
            // Si el token no es válido, limpiar y intentar auto-login demo
            localStorage.removeItem('usuario')
            localStorage.removeItem('token')
            delete axios.defaults.headers.common['Authorization']
            
            // Verificar modo demo e intentar auto-login
            const isDemoMode = await checkDemoMode()
            if (isDemoMode) {
              await autoLoginDemo()
            }
          }
        } catch (error) {
          localStorage.removeItem('usuario')
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
          
          // Intentar auto-login demo como fallback
          const isDemoMode = await checkDemoMode()
          if (isDemoMode) {
            await autoLoginDemo()
          }
        }
      } else {
        // Si no hay usuario logueado, verificar modo demo
        const isDemoMode = await checkDemoMode()
        
        if (isDemoMode) {
          const demoUser = await autoLoginDemo()
        }
      }
      
      setCargando(false)
    }

    initializeApp()
  }, [])

  const iniciarSesion = (datosUsuario, token) => {
    setUsuario(datosUsuario)
    localStorage.setItem('usuario', JSON.stringify(datosUsuario))
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const cerrarSesion = () => {
    setUsuario(null)
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const actualizarUsuario = (nuevosDatos) => {
    setUsuario(nuevosDatos)
    localStorage.setItem('usuario', JSON.stringify(nuevosDatos))
  }

  const valor = {
    usuario,
    cargando,
    iniciarSesion,
    cerrarSesion,
    actualizarUsuario,
    estaAutenticado: !!usuario,
    esAdmin: usuario?.rol === 'admin',
    isAdmin: usuario?.rol === 'admin', // Compatibilidad con componentes que usan isAdmin
    checkDemoMode, // Exponer función para verificar modo demo
    autoLoginDemo // Exponer función para auto-login manual si es necesario
  }

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  )
}