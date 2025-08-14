import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { getProductImageUrl } from "../utils/imageHelper"

const Home = () => {
  const { estaAutenticado } = useAuth()
  const [destacados, setDestacados] = useState([])

  useEffect(() => {
    const fetchDestacados = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/productos')
        
        // Toma los primeros 6 activos con stock
        const list = (data || []).filter(p => p.activo && p.stock?.disponible && (p.stock?.cantidad || 0) > 0).slice(0, 6)
        setDestacados(list)
      } catch (e) {
        setDestacados([])
      }
    }
    fetchDestacados()
  }, [])

  return (
    <div className="bg-white min-h-screen font-['Inter'] text-[#3A2400] flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-[#FFF8ED] to-white py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h1 className="font-['Gabarito'] text-[#5E3B00] text-4xl md:text-6xl font-bold mb-4 leading-tight">
                Productos Dietéticos al alcance de tu mano
              </h1>
              <p className="text-lg mb-8 leading-relaxed">
                En nuestra plataforma vas a encontrar productos dietéticos de
                calidad, accesibles desde cualquier lugar. Conectamos tiendas
                físicas con personas que buscan una alimentación saludable.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/productos" 
                  className="px-8 py-3 bg-[#D3B178] text-[#3A2400] font-semibold rounded-lg hover:bg-[#b39869] hover:text-white transition duration-200 shadow-md"
                >
                  Explorar Productos
                </Link>
                {!estaAutenticado && (
                  <Link 
                    to="/register" 
                    className="px-8 py-3 border-2 border-[#D3B178] text-[#5E3B00] font-semibold rounded-lg hover:bg-[#FFF8ED] transition duration-200"
                  >
                    Crear Cuenta
                  </Link>
                )}
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="relative">
                <img 
                  src="/imgs/fondos/home-1.webp" 
                  alt="Productos dietéticos" 
                  className="w-full h-auto rounded-2xl shadow-xl object-cover"
                />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#D3B178] rounded-full opacity-20 z-0"></div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#D3B178] rounded-full opacity-20 z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="font-['Gabarito'] text-[#5E3B00] text-3xl md:text-4xl font-bold mb-12 text-center">
            ¿Por qué elegirnos?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FFF8ED] rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 border border-[#D3B178]">
              <div className="w-14 h-14 bg-[#D3B178] rounded-full flex items-center justify-center mb-4">
                <img src="/imgs/icons/check-circle.svg" alt="check" className="w-8 h-8" />
              </div>
              <h3 className="font-['Gabarito'] text-[#5E3B00] text-xl font-bold mb-3">Variedad y Calidad</h3>
              <p className="text-[#3A2400]">
                Seleccionamos cuidadosamente cada producto para ofrecerte solo lo mejor en alimentación saludable.
              </p>
            </div>
            
            <div className="bg-[#FFF8ED] rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 border border-[#D3B178]">
              <div className="w-14 h-14 bg-[#D3B178] rounded-full flex items-center justify-center mb-4">
                <img src="/imgs/icons/check-circle.svg" alt="check" className="w-8 h-8" />
              </div>
              <h3 className="font-['Gabarito'] text-[#5E3B00] text-xl font-bold mb-3">Enfoque en la Salud</h3>
              <p className="text-[#3A2400]">
                Priorizamos productos que contribuyan a un estilo de vida saludable y balanceado.
              </p>
            </div>
            
            <div className="bg-[#FFF8ED] rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 border border-[#D3B178]">
              <div className="w-14 h-14 bg-[#D3B178] rounded-full flex items-center justify-center mb-4">
                <img src="/imgs/icons/check-circle.svg" alt="check" className="w-8 h-8" />
              </div>
              <h3 className="font-['Gabarito'] text-[#5E3B00] text-xl font-bold mb-3">Recomendaciones Reales</h3>
              <p className="text-[#3A2400]">
                Nuestra comunidad comparte experiencias genuinas para ayudarte a elegir lo mejor.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Personalización Section */}
      <section className="w-full bg-[#FFF8ED] py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="font-['Gabarito'] text-[#5E3B00] text-3xl md:text-4xl font-bold mb-6">
                Nos importa tu alimentación
              </h2>
              <p className="text-lg mb-6">
                Sabemos que cada persona tiene necesidades diferentes. Por eso, te
                ayudamos a encontrar los productos ideales para tu estilo de vida.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <img src="/imgs/icons/triangle.svg" alt="triangle" className="w-6 h-6 mt-1" />
                  <p className="font-medium">¿Hacés deporte y querés cuidar tu alimentación?</p>
                </div>
                <div className="flex items-start space-x-3">
                  <img src="/imgs/icons/triangle.svg" alt="triangle" className="w-6 h-6 mt-1" />
                  <p className="font-medium">¿Estás cumpliendo una dieta estricta?</p>
                </div>
                <div className="flex items-start space-x-3">
                  <img src="/imgs/icons/triangle.svg" alt="triangle" className="w-6 h-6 mt-1" />
                  <p className="font-medium">¿Sos celíaco?</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <div className="relative">
                <img 
                  src="/imgs/fondos/home-2.webp" 
                  alt="Alimentos saludables" 
                  className="w-full h-auto rounded-2xl shadow-xl object-cover"
                />
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#D3B178] rounded-full opacity-20 z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Inicio de sesion */}
      {!estaAutenticado && (
        <section className="w-full py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col items-center text-center">
              <h2 className="font-['Gabarito'] text-[#5E3B00] text-3xl md:text-4xl font-bold mb-6">
                ¿Qué esperas para comenzar?
              </h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link 
                  to="/login" 
                  className="px-12 py-3 border-2 border-[#D3B178] text-[#482D00] font-semibold rounded-lg hover:bg-[#b39869] hover:text-white transition duration-200"
                >
                  Iniciar sesión
                </Link>
                <Link 
                  to="/register" 
                  className="px-12 py-3 bg-[#D3B178] text-[#482D00] font-semibold rounded-lg hover:bg-[#b39869] hover:text-white transition duration-200"
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Productos Destacados */}
      <section className="w-full py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col items-center text-center mb-10">
            <h2 className="font-['Gabarito'] text-[#5E3B00] text-3xl md:text-4xl font-bold mb-4">
              Explora nuestros productos destacados
            </h2>
          </div>
          {destacados.length > 0 && (
            <div className="bg-[#FFF8ED] border border-[#D3B178] rounded-xl shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {destacados.map(p => (
                  <Link key={p._id} to={`/producto/${p.slug || p._id}`} className="bg-white rounded-xl shadow-lg border border-[#D3B178] overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      <img 
                        src={p.imagen ? getProductImageUrl(p.imagen) : '/imgs/icons/placeholder.svg'} 
                        alt={p.nombre} 
                        className="w-full h-48 object-cover bg-white"
                        onError={(e) => {
                          if (!e.target.hasAttribute('data-error-handled')) {
                            e.target.setAttribute('data-error-handled', 'true')
                            console.log('Error cargando imagen:', p.nombre)
                            e.target.src = '/imgs/icons/placeholder.svg'
                          }
                        }} 
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-['Epilogue'] font-bold text-[#5E3B00] text-lg mb-1 line-clamp-2">{p.nombre}</h3>
                      <span className="inline-block bg-[#FFF1D9] text-[#815100] px-2 py-1 rounded-lg text-xs font-medium">{p.categoria}</span>
                      <p className="text-[#4D3000] text-sm mt-2 line-clamp-2">{p.descripcion}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-col items-center text-center mt-12">
            <h2 className="font-['Gabarito'] text-[#5E3B00] text-3xl md:text-4xl font-bold mb-4">
              ¿Buscás más opciones saludables?
            </h2>
            <p className="text-lg max-w-3xl mb-8">
              Conocé toda nuestra línea de productos dietéticos, sin TACC,
              orgánicos, proteicos y más.
            </p>
            <div>
              <Link
                to="/productos"
                className="px-12 py-3 bg-[#FFF6E8] border-2 border-[#4D3000] text-[#6D4400] font-semibold
                  rounded-lg hover:bg-[#b39869] hover:text-white transition duration-200"
              >
                VER TODOS LOS PRODUCTOS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
