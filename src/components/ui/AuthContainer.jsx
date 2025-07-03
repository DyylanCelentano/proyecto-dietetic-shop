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

                {/* Separador */}
                <div className="separador-social flex items-center my-6">
                  <div className="linea-separadora flex-1 h-px bg-gray-300"></div>
                  <span className="texto-separador px-4 text-gray-500 text-sm font-['Gabarito']">
                    o {isLogin ? "iniciá sesión" : "registrate"} con redes
                    sociales
                  </span>
                  <div className="linea-separadora flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Botones de redes sociales - Solo Google y Facebook */}
                <div className="botones-sociales flex justify-center space-x-6">
                  <button className="boton-social w-12 h-12 rounded-lg bg-[#FFF8ED] hover:bg-[#D3B178] border border-[#D3B178] flex items-center justify-center transition-colors group">
                    <svg
                      className="w-5 h-5 text-gray-600 group-hover:text-red-500"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </button>

                  <button className="boton-social w-12 h-12 rounded-lg bg-[#FFF8ED] hover:bg-[#D3B178] border border-[#D3B178] flex items-center justify-center transition-colors group">
                    <svg
                      className="w-5 h-5 text-gray-600 group-hover:text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                </div>
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

                {/* Separador */}
                <div className="separador-social flex items-center my-4">
                  <div className="linea-separadora flex-1 h-px bg-gray-300"></div>
                  <span className="texto-separador px-4 text-gray-500 text-xs font-['Gabarito']">
                    o {isLogin ? "iniciá sesión" : "registrate"} con redes
                    sociales
                  </span>
                  <div className="linea-separadora flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Botones de redes sociales */}
                <div className="botones-sociales flex justify-center space-x-4 mb-6">
                  <button className="boton-social w-10 h-10 rounded-lg bg-[#FFF8ED] hover:bg-[#D3B178] border border-[#D3B178] flex items-center justify-center transition-colors group">
                    <svg
                      className="w-4 h-4 text-gray-600 group-hover:text-red-500"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </button>

                  <button className="boton-social w-10 h-10 rounded-lg bg-[#FFF8ED] hover:bg-[#D3B178] border border-[#D3B178] flex items-center justify-center transition-colors group">
                    <svg
                      className="w-4 h-4 text-gray-600 group-hover:text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
