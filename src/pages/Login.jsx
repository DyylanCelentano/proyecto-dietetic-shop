import { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí puedes agregar la lógica de autenticación
    console.log('Login attempt:', formData)
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
                  className="w-full rounded-lg border-[1px] border-[#D6B08C] px-3 py-2 focus:border-orange-600 focus:ring-2 focus:ring-orange-200" 
                  placeholder="tucorreo@ejemplo.com" 
                  required 
                />
              </div>
              
              <div className="space-y-2 text-left">
                <label className="block text-gray-700">Contraseña</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border-[1px] border-[#D6B08C] px-3 py-2 focus:border-orange-600 focus:ring-2 focus:ring-orange-200" 
                  placeholder="••••••••••" 
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-orange-600 border-2 border-orange-900 text-white font-semibold py-2 rounded-lg hover:bg-orange-200 hover:text-brown-800 transition-colors"
              >
                Iniciar Sesión
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
