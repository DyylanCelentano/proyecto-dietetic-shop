import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../hooks/useAuth.jsx'

const AuthButtons = () => {
  const { usuario, cerrarSesion: cerrarSesionContext } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()
  const { mostrarExito } = useToast()

  const cerrarSesion = () => {
    cerrarSesionContext()
    setMenuAbierto(false)
    mostrarExito("Sesión cerrada exitosamente")
    navigate('/')
  }

  const obtenerIniciales = (nombre) => {
    if (!nombre) return 'U'
    return nombre
      .split(' ')
      .map(palabra => palabra.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Si no hay usuario autenticado, mostrar botones de login/register
  if (!usuario) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="bg-[#5E3B00] text-white px-4 py-2 rounded-lg font-['Gabarito'] font-semibold hover:bg-[#815100] transition-colors duration-200 shadow-md"
        >
          Iniciar sesión
        </Link>
        <Link
          to="/register"
          className="bg-white text-[#5E3B00] border-2 border-[#5E3B00] px-4 py-2 rounded-lg font-['Gabarito'] font-semibold hover:bg-[#5E3B00] hover:text-white transition-colors duration-200 shadow-md"
        >
          Registrarse
        </Link>
      </div>
    )
  }

  // Si hay usuario autenticado, mostrar avatar y menú
  return (
    <div className="relative">
      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="flex items-center space-x-2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        <div className="w-8 h-8 bg-[#5E3B00] rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">
            {obtenerIniciales(usuario.username || usuario.email)}
          </span>
        </div>
        <span className="text-[#3A2400] font-['Gabarito'] font-semibold hidden md:block">
          {usuario.username || usuario.email}
        </span>
        <i className="fas fa-chevron-down text-[#5E3B00] text-xs"></i>
      </button>

      {/* Menú desplegable */}
      {menuAbierto && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm text-gray-600">Sesión iniciada como</p>
              <p className="text-sm font-semibold text-[#3A2400]">
                {usuario.username || usuario.email}
              </p>
            </div>
            
            <Link
              to="/perfil"
              className="block px-4 py-2 text-sm text-[#3A2400] hover:bg-gray-50 transition-colors"
            >
              <i className="fas fa-user mr-2"></i>
              Mi Perfil
            </Link>
            
            {usuario.rol === 'admin' && (
              <Link
                to="/admin"
                className="block px-4 py-2 text-sm text-[#3A2400] hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-cog mr-2"></i>
                Panel Admin
              </Link>
            )}
            
            <button
              onClick={cerrarSesion}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* Overlay para cerrar menú al hacer clic fuera */}
      {menuAbierto && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuAbierto(false)}
        ></div>
      )}
    </div>
  )
}

export default AuthButtons 