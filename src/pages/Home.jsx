import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-[#FFF8ED] min-h-screen p-6 font-['Gabarito'] flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl">
        {/* Card 1 */}
        <div
          className="w-full max-w-[600px] aspect-[16/9] bg-white p-4 rounded-xl border border-[#5E3B00]
                  shadow-md flex flex-col mx-auto"
        >
          <div>
            <h2 className="text-[#6D4400] text-3xl md:text-5xl font-bold mb-2">
              Productos Dietéticos al alcance de tu mano
            </h2>
            <p className="text-[#3A2400] font-['Esteban'] text-base md:text-lg mb-4">
              En nuestra plataforma vas a encontrar productos dietéticos de
              calidad, accesibles desde cualquier lugar. Conectamos tiendas
              físicas con personas que buscan una alimentación saludable, fácil
              y segura.
            </p>
          </div>
          <ul className="space-y-2 font-['Enriqueta'] text-black font-semibold text-lg md:text-2xl">
            <li className="flex items-center space-x-2">
              <img
                src="/imgs/icons/check-circle.svg"
                alt="check"
                className="w-6 h-6"
              />
              <span>Variedad y Calidad</span>
            </li>
            <li className="flex items-center space-x-2">
              <img
                src="/imgs/icons/check-circle.svg"
                alt="check"
                className="w-6 h-6"
              />
              <span>Enfoque en la Salud</span>
            </li>
            <li className="flex items-center space-x-2">
              <img
                src="/imgs/icons/check-circle.svg"
                alt="check"
                className="w-6 h-6"
              />
              <span>Recomendaciones reales de usuarios</span>
            </li>
          </ul>
        </div>

        {/* Imagen 1 */}
        <div className="w-full max-w-[600px] aspect-[16/9] rounded-xl overflow-hidden mx-auto">
          <img
            src="/imgs/fondos/home-1.webp"
            alt="Frutos secos"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Imagen 2 */}
        <div className="w-full max-w-[600px] aspect-[16/9] rounded-xl overflow-hidden mx-auto">
          <img
            src="/imgs/fondos/home-2.webp"
            alt="Legumbres"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Card 2 */}
        <div
          className="w-full max-w-[600px] aspect-[16/9] bg-white p-4 rounded-xl border border-[#5E3B00]
                  shadow-md flex flex-col mx-auto"
        >
          <div>
            <h2 className="text-[#6D4400] text-3xl md:text-5xl font-bold mb-2">
              Nos importa tu alimentación
            </h2>
            <p className="text-[#3A2400] font-['Esteban'] text-base md:text-lg mb-4">
              Sabemos que cada persona tiene necesidades diferentes. Por eso, te
              ayudamos a encontrar los productos ideales para tu estilo de vida.
            </p>
          </div>
          <ul className="space-y-2 font-['Enriqueta'] text-black font-semibold text-lg md:text-2xl">
            <li className="flex items-center space-x-2">
              <img
                src="/imgs/icons/triangle.svg"
                alt="triangle"
                className="w-6 h-6"
              />
              <span>¿Hacés deporte y querés cuidar tu alimentación?</span>
            </li>
            <li className="flex items-center space-x-2">
              <img
                src="/imgs/icons/triangle.svg"
                alt="triangle"
                className="w-6 h-6"
              />
              <span>¿Estás cumpliendo una dieta estricta?</span>
            </li>
            <li className="flex items-center space-x-2">
              <img
                src="/imgs/icons/triangle.svg"
                alt="triangle"
                className="w-6 h-6"
              />
              <span>¿Sos celíaco?</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center mt-16 text-center w-full">
        <h2 className="text-[#5E3B00] text-4xl font-bold mb-6">
          ¿Qué esperas para comenzar?
        </h2>
        <div className="flex flex-col sm:flex-row gap-12 mb-10 text-xl">
          <Link
            to="/login"
            className="px-20 py-2 border-2 border-[#D3B178] text-[#482D00] font-semibold
              rounded-md hover:bg-[#b39869] hover:text-white transition duration-200"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/register"
            className="px-20 py-2 bg-[#D3B178] text-[#482D00] font-semibold
              rounded-md hover:bg-[#b39869] hover:text-white transition duration-200"
          >
            Registrarse
          </Link>
        </div>
      </div>

      {/* Sección de Comunidad */}
      <div className="flex flex-col items-center mt-16 text-center w-full">
        <h3 className="text-[#5E3B00] text-3xl font-bold mt-14 mb-2">
          Únete a nuestra comunidad
        </h3>
        <p className="text-[#3A2400] font-['Esteban'] text-xl">
          Conocé recetas, compartí experiencias y encontrá recomendaciones
          reales de personas como vos.
        </p>
      </div>
      <div className="w-full max-w-7xl mt-10 bg-[#FFF1D9] border border-[#5E3B00] rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="bg-[#E8CFA7] rounded-xl p-4 flex flex-col shadow-sm border border-[#5E3B00] h-full">
            <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="border-t border-[#5E3B00] my-2 -mx-4"></div>
            <div className="text-base text-black mt-2">
              <p>
                <span className="font-semibold">Producto: </span>
                Ejemplo producto 1
              </p>
              <p>
                <span className="font-semibold">Comentario: </span>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Dolorum, at!
              </p>
            </div>
          </div>

          <div className="bg-[#E8CFA7] rounded-xl p-4 flex flex-col shadow-sm border border-[#5E3B00] h-full">
            <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="border-t border-[#5E3B00] my-2 -mx-4"></div>
            <div className="text-base text-black mt-2">
              <p>
                <span className="font-semibold">Producto: </span>
                Ejemplo producto 2
              </p>
              <p>
                <span className="font-semibold">Comentario: </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Deserunt, eaque! Id laboriosam hic voluptate. Totam.
              </p>
            </div>
          </div>

          <div className="bg-[#E8CFA7] rounded-xl p-4 flex flex-col shadow-sm border border-[#5E3B00] h-full">
            <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="border-t border-[#5E3B00] my-2 -mx-4"></div>
            <div className="text-base text-black mt-2">
              <p>
                <span className="font-semibold">Producto: </span>
                Ejemplo producto 3
              </p>
              <p>
                <span className="font-semibold">Comentario: </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Blog */}
      <div className="flex flex-col items-center mt-16 text-center w-full">
        <h2 className="text-[#5E3B00] text-4xl font-bold mb-3">
          ¿Querés ser parte de nuestra comunidad?
        </h2>
        <p className="text-[#3A2400] font-['Esteban'] text-xl">
          Compartí tus experiencias, aprendé y conectá con otros amantes de la
          alimentación saludable.{" "}
        </p>
        <div className="flex flex-col sm:flex-row gap-12 my-6 text-xl">
          <Link
            to="/blog"
            className="px-20 py-2 bg-[#FFF6E8] border-2 border-[#4D3000] text-[#6D4400] font-semibold
              rounded-md hover:bg-[#b39869] hover:text-white transition duration-200"
          >
            ÚNETE AL BLOG
          </Link>
        </div>
      </div>

      {/* Sección Productos */}
      <div className="flex flex-col items-center mt-16 text-center w-full">
        <h3 className="text-[#5E3B00] text-3xl font-bold mt-8">
          Explora nuestros productos destacados
        </h3>
      </div>
      <div className="w-full max-w-7xl mt-10 bg-[#FFF1D9] border border-[#5E3B00] rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="bg-[#FFFAF2] rounded-xl p-4 flex flex-col shadow-sm border-2 border-[#4D3000] h-full">
            <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="border-t-2 border-[#4D3000] my-2 -mx-4"></div>
            <div className="mt-2 text-base text-[#4D3000]">
              <p>
                <span className="font-semibold">Nombre: </span>
                Ejemplo Producto 1
              </p>
              <p>
                <span className="font-semibold">Peso: </span>
                420g
              </p>
              <p>
                <span className="font-semibold text-[#088714]">
                  Precio: $349
                </span>
              </p>
              <p>
                <span className="font-semibold">Descripción: </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Provident ut pariatur itaque tempore numquam labore voluptates
                excepturi reprehenderit delectus?
              </p>
            </div>
          </div>

          <div className="flex-1 bg-[#FFFAF2] rounded-xl p-4 flex flex-col justify-between shadow-sm border-2 border-[#4D3000] h-full">
            <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="border-t-2 border-[#4D3000] my-2 -mx-4"></div>
            <div className="mt-2 text-base text-[#4D3000]">
              <p>
                <span className="font-semibold">Nombre: </span>
                Ejemplo Producto 2
              </p>
              <p>
                <span className="font-semibold">Peso: </span>
                250g
              </p>
              <p>
                <span className="font-semibold text-[#088714]">
                  Precio: $400
                </span>
              </p>
              <p>
                <span className="font-semibold">Descripción: </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellat, asperiores.
              </p>
            </div>
          </div>

          <div className="flex-1 bg-[#FFFAF2] rounded-xl p-4 flex flex-col justify-between shadow-sm border-2 border-[#4D3000] h-full">
            <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
              <span className="text-gray-500">Imagen del producto</span>
            </div>
            <div className="border-t-2 border-[#4D3000] my-2 -mx-4"></div>
            <div className="mt-2 text-base text-[#4D3000]">
              <p>
                <span className="font-semibold">Nombre: </span>
                Ejemplo Producto 3
              </p>
              <p>
                <span className="font-semibold">Peso: </span>
                500g
              </p>
              <p>
                <span className="font-semibold text-[#088714]">
                  Precio: $850
                </span>
              </p>
              <p>
                <span className="font-semibold">Descripción: </span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore voluptates expedita ut unde doloremque incidunt!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-16 text-center w-full">
        <h2 className="text-[#5E3B00] text-4xl font-bold mb-3">
          ¿Buscás más opciones saludables?
        </h2>
        <p className="text-[#3A2400] font-['Esteban'] text-xl">
          Conocé toda nuestra línea de productos dietéticos, sin TACC,
          orgánicos, proteicos y más.
        </p>
        <div className="flex flex-col sm:flex-row gap-12 my-6 text-xl">
          <Link
            to="/productos"
            className="px-20 py-2 bg-[#FFF6E8] border-2 border-[#4D3000] text-[#6D4400] font-semibold
              rounded-md hover:bg-[#b39869] hover:text-white transition duration-200"
          >
            VER TODOS LOS PRODUCTOS
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
