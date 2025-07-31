import { Link } from "react-router-dom";


const AuthContainer = ({ children, mode }) => {




  const isLogin = mode === "login";

  return (
    <div className="contenedor-auth min-h-screen bg-[#FFF8ED] flex items-center justify-center p-4">
      {/* Navegación superior */}
      <nav className="navegacion-flotante fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="logo-auth text-xl font-['Epilogue'] font-extrabold text-[#3A2400] hover:text-[#815100] transition-colors bg-[#D3B178]/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm drop-shadow-[2px_2px_0_#FFDB9E]"
        >
          Dietetic&#8722;Shop
        </Link>
      </nav>

      {/* Contenedor principal */}
      <div className="tarjeta-auth w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden relative min-h-[600px] md:h-[600px]">
        {/* Panel deslizante con colores del proyecto - Solo desktop */}
        <div
          className={`
            panel-deslizante absolute top-0 w-1/2 h-full
            bg-gradient-to-br from-[#815100] via-[#5E3B00] to-[#3A2400]
            transition-all duration-700 ease-in-out z-10 shadow-2xl
            hidden md:block
            ${isLogin ? "left-0 rounded-l-3xl rounded-r-[80px]" : "left-1/2 rounded-r-3xl rounded-l-[80px]"}
          `}
        >
          <div className="contenido-panel h-full flex flex-col justify-center items-center text-white p-8">
            {isLogin ? (
              <>
                <h2 className="titulo-panel text-3xl font-['Gabarito'] font-light mb-4 text-center text-white drop-shadow-lg">
                  ¡Hola, Bienvenido!
                </h2>
                <p className="subtitulo-panel text-white/80 mb-8 text-center">
                  ¿No tenés una cuenta?
                </p>
                <Link
                  to="/register"
                  className="boton-cambio border-2 border-white text-white px-8 py-3 rounded-full font-['Gabarito'] font-medium hover:bg-white hover:text-[#3A2400] transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Registrarse
                </Link>
              </>
            ) : (
              <>
                <h2 className="titulo-panel text-3xl font-['Gabarito'] font-light mb-4 text-center text-white drop-shadow-lg">
                  ¡Bienvenido de Vuelta!
                </h2>
                <p className="subtitulo-panel text-white/80 mb-8 text-center">
                  ¿Ya tenés una cuenta?
                </p>
                <Link
                  to="/login"
                  className="boton-cambio border-2 border-white text-white px-8 py-3 rounded-full font-['Gabarito'] font-medium hover:bg-white hover:text-[#3A2400] transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Contenedor del formulario - Responsive */}
        <div className="contenedor-formulario h-full">
          {/* Layout Desktop */}
          <div className="hidden md:grid md:grid-cols-2 h-full">
            {/* Sección formulario - se mueve según el modo */}
            <div
              className={`seccion-formulario flex flex-col justify-center p-8 lg:p-12 ${isLogin ? "order-2" : "order-1"}`}
            >
              <div className="formulario-contenido max-w-sm mx-auto w-full">
                {/* Título del formulario */}
                <div className="encabezado-formulario mb-8">
                  <h1 className="titulo-formulario text-3xl font-['Gabarito'] font-bold text-[#3A2400] mb-4">
                    {isLogin ? "Iniciar Sesión" : "Registro"}
                  </h1>
                </div>

                {/* Contenido del formulario */}
                {children}

                {/* Separador eliminado - No se requieren botones de redes sociales */}
              </div>
            </div>

            {/* Espacio para el panel deslizante */}
            <div
              className={`espacio-panel ${isLogin ? "order-1" : "order-2"}`}
            ></div>
          </div>

          {/* Layout Mobile */}
          <div className="md:hidden flex flex-col h-full">
            {/* Panel superior en mobile */}
            <div className="panel-mobile bg-gradient-to-r from-[#815100] via-[#5E3B00] to-[#3A2400] text-white p-6 text-center rounded-t-3xl">
              <h2 className="text-2xl font-['Gabarito'] font-light mb-2 drop-shadow-lg">
                {isLogin ? "¡Hola, Bienvenido!" : "¡Bienvenido de Vuelta!"}
              </h2>
              <p className="text-white/80 text-sm mb-4">
                {isLogin ? "¿No tenés una cuenta?" : "¿Ya tenés una cuenta?"}
              </p>
              <Link
                to={isLogin ? "/register" : "/login"}
                className="inline-block border border-white text-white px-6 py-2 rounded-full font-['Gabarito'] font-medium hover:bg-white hover:text-[#3A2400] transition-all duration-300 text-sm"
              >
                {isLogin ? "Registrarse" : "Iniciar Sesión"}
              </Link>
            </div>

            {/* Formulario en mobile */}
            <div className="formulario-mobile flex-1 p-6 overflow-y-auto">
              <div className="formulario-contenido max-w-sm mx-auto w-full">
                {/* Título del formulario */}
                <div className="encabezado-formulario mb-6">
                  <h1 className="titulo-formulario text-2xl font-['Gabarito'] font-bold text-[#3A2400] mb-2 text-center">
                    {isLogin ? "Iniciar Sesión" : "Registro"}
                  </h1>
                </div>

                {/* Contenido del formulario */}
                {children}

                {/* Separador eliminado - No se requieren botones de redes sociales */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
