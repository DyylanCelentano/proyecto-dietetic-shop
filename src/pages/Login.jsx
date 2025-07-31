import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotificaciones } from '../hooks/useNotificaciones'
import Cargando from '../components/ui/Cargando'

const Login = () => {
  const navigate = useNavigate()
  const { iniciarSesion, cargando } = useAuth()
  const { mostrarExito, mostrarError } = useNotificaciones()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [errores, setErrores] = useState({})

  const handleChange = (e) => {
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[e.target.name]) {
      setErrores(prev => ({
        ...prev,
        [e.target.name]: ''
      }))
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nuevosErrores.email = 'El correo electrónico no es válido'
    }

    if (!formData.password.trim()) {
      nuevosErrores.password = 'La contraseña es obligatoria'
    } else if (formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    try {
      const resultado = await iniciarSesion(formData)
      
      if (resultado.exito) {
        mostrarExito('¡Bienvenido! Has iniciado sesión correctamente')
        navigate('/')
      } else {
        mostrarError(resultado.mensaje)
      }
    } catch (error) {
      mostrarError('Error inesperado. Por favor, intenta nuevamente')
    }
  }

  if (cargando) {
    return (
      <div className="relative h-screen flex items-center justify-center">
        <Cargando mensaje="Iniciando sesión..." />
      </div>
    )
  }

  return (
    <div className="relative h-screen">      <div 
        className="absolute inset-0 z-[-2] bg-cover bg-center blur-sm bg-black/30"
        style={{
          backgroundImage: "url('/imgs/fondos/fondo-frutos-secos.webp')"
        }}
      ></div>
      <div className="absolute inset-0 z-[-1] bg-black/30"></div>

      <div className="flex flex-col h-screen">
        <nav className="bg-[#F5F2F0] px-[5%] py-4 flex justify-between items-center shadow-md">
          <Link to="/" className="text-2xl font-bold text-black">
            Dietetic-Shop
          </Link>
        </nav>

        <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl p-12 text-center">            <img 
              src="/imgs/deco/fruto-seco-login.webp" 
              alt="Decoración fruto seco" 
              className="w-20 mx-auto pb-4" 
            />
            <h2 className="text-3xl font-bold text-[#C2410C] mb-8">
              ¡Inicia sesión aquí!
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="block text-gray-700">Correo Electrónico</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border-[1px] px-3 py-2 focus:ring-2 transition-colors ${
                    errores.email 
                      ? 'border-red-500 focus:border-red-600 focus:ring-red-200' 
                      : 'border-[#D6B08C] focus:border-orange-600 focus:ring-orange-200'
                  }`}
                  placeholder="tucorreo@ejemplo.com" 
                  disabled={cargando}
                />
                {errores.email && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    {errores.email}
                  </p>
                )}
              </div>
              
              <div className="space-y-2 text-left">
                <label className="block text-gray-700">Contraseña</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-lg border-[1px] px-3 py-2 focus:ring-2 transition-colors ${
                    errores.password 
                      ? 'border-red-500 focus:border-red-600 focus:ring-red-200' 
                      : 'border-[#D6B08C] focus:border-orange-600 focus:ring-orange-200'
                  }`}
                  placeholder="••••••••••" 
                  disabled={cargando}
                />
                {errores.password && (
                  <p className="text-red-600 text-sm mt-1 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    {errores.password}
                  </p>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={cargando}
                className="w-full bg-orange-600 border-2 border-orange-900 text-white font-semibold py-2 rounded-lg hover:bg-orange-200 hover:text-brown-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {cargando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            <div className="mt-8 p-4 bg-orange-50 border border-orange-600 rounded-xl">
              <strong className="block text-gray-700">¿No tienes una cuenta?</strong>
              <p className="my-3 text-gray-600">
                Únete a Dietetic-Shop para obtener acceso total a todo lo que ofrecemos.
              </p>
              <Link 
                to="/register" 
                className="inline-block bg-orange-600 border-2 border-orange-900 text-white font-semibold px-6 py-2 rounded-lg hover:bg-orange-200 hover:text-brown-800 transition-colors"
              >
                Regístrate aquí
              </Link>
            </div>

            <p className="mt-6">
              <a 
                href="#" 
                className="text-orange-900 hover:text-orange-600 underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Login