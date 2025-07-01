import { Link } from "react-router-dom"
import categories from "../constants/categories"
import filterCategories from "../constants/filterCategories"

const Home = () => {

  return (
    <div className="bg-[#FFF8ED] min-h-screen p-6 font-['Gabarito'] flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="w-[600px] aspect-[16/9] bg-white p-4 rounded-xl border border-[#5E3B00] 
                        shadow-md flex flex-col">
          <div>
            <h2 className="text-[#6D4400] text-5xl font-bold mb-2">
              Productos Dietéticos al alcance de tu mano
            </h2>
            <p className="text-[#3A2400] font-['Esteban'] text-lg mb-4">
              En nuestra plataforma vas a encontrar productos dietéticos de calidad, accesibles desde   cualquier   lugar. Conectamos tiendas físicas con personas que buscan una alimentación  saludable, fácil y   segura.
            </p>
          </div>
          <ul className="space-y-2 font-['Enriqueta'] text-black font-semibold text-2xl">
            <li className="flex items-center space-x-2">
              <img src="/imgs/icons/check-circle.svg" alt="check" className="w-6 h-6" />
              <span>Variedad y Calidad</span>
            </li>
            <li className="flex items-center space-x-2">
              <img src="/imgs/icons/check-circle.svg" alt="check" className="w-6 h-6" />
              <span>Enfoque en la Salud</span>
            </li>
            <li className="flex items-center space-x-2">
              <img src="/imgs/icons/check-circle.svg" alt="check" className="w-6 h-6" />
              <span>Recomendaciones reales de usuarios</span>
            </li>
          </ul>
        </div>

        {/* Imagen 1 */}
        <div className="w-[600px] aspect-[16/9] rounded-xl overflow-hidden mx-auto">
          <img src="/imgs/fondos/home-1.webp" alt="Frutos secos" className="w-full h-full object-cover" />
        </div>

        {/* Imagen 2 */}
        <div className="w-[600px] aspect-[16/9] rounded-xl overflow-hidden mx-auto">
          <img src="/imgs/fondos/home-2.webp" alt="Legumbres" className="w-full h-full object-cover" />
        </div>

        {/* Card 2 */}
        <div className="w-[600px] aspect-[16/9] bg-white p-4 rounded-xl border border-[#5E3B00] 
                        shadow-md flex flex-col mx-auto">
          <div>
            <h2 className="text-[#6D4400] text-5xl font-bold mb-2">
              Nos importa tu alimentación
            </h2>
            <p className="text-[#3A2400] font-['Esteban'] text-lg mb-4">
              Sabemos que cada persona tiene necesidades diferentes. Por eso, te ayudamos a encontrar los productos ideales para tu estilo de vida.
            </p>
          </div>
          <ul className="space-y-2 font-['Enriqueta'] text-black font-semibold text-2xl">
            <li className="flex items-center space-x-2">
              <img src="/imgs/icons/triangle.svg" alt="triangle" className="w-6 h-6" />
              <span>¿Hacés deporte y querés cuidar tu alimentación?</span>
            </li>
            <li className="flex items-center space-x-2">
              <img src="/imgs/icons/triangle.svg" alt="triangle" className="w-6 h-6" />
              <span>¿Estás cumpliendo una dieta estricta?</span>
            </li>
            <li className="flex items-center space-x-2">
              <img src="/imgs/icons/triangle.svg" alt="triangle" className="w-6 h-6" />
              <span>¿Sos celíaco?</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center mt-16 text-center w-full">
        <h2 className="text-[#5E3B00] text-4xl font-bold mb-6">¿Qué esperas para comenzar?</h2>
        <div className="flex flex-col sm:flex-row gap-12 mb-10 text-xl">
          <Link to="/login"
              className="px-20 py-2 border border-[#D3B178] text-[#482D00] font-semibold 
              rounded-md hover:bg-[#b39869] hover:text-white transition duration-200"
            >
            Iniciar sesión
          </Link>
          <Link to="/register"
              className="px-20 py-2 bg-[#D3B178] text-[#482D00] font-semibold 
              rounded-md hover:bg-[#b39869] hover:text-white transition duration-200"
            >
            Registrarse
          </Link>
        </div>
        <div>
          <h3 className="text-[#5E3B00] text-3xl font-bold mt-14 mb-2">Únete a nuestra comunidad</h3>
            <p className="text-[#3A2400] font-['Esteban'] text-xl">
              Conocé recetas, compartí experiencias y encontrá recomendaciones reales de personas como vos.
            </p>
        </div>
      </div>
    </div>
  )
}

export default Home
