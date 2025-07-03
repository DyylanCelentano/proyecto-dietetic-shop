
const FormContainer = ({
  children,
  titulo,
  subtitulo = "",
  mostrarImagen = true,
}) => {
  return (
    <div className="pantalla-completa relative min-h-screen">
      {/* Fondo con imagen borrosa */}
      <div
        className="fondo-imagen absolute inset-0 z-[-2] bg-cover bg-center blur-sm"
        style={{
          backgroundImage: "url('/imgs/fondos/fondo-frutos-secos.webp')",
        }}
      ></div>

      {/* Overlay oscuro */}
      <div className="overlay-oscuro absolute inset-0 z-[-1] bg-black/40"></div>

      <div className="contenedor-principal flex flex-col min-h-screen">
        {/* Navegación simplificada */}
        <nav className="navegacion-auth bg-[#F5F2F0] px-[5%] py-4 flex justify-between items-center shadow-md">
          <a
            href="/"
            className="logo-principal text-2xl font-['Epilogue'] font-extrabold text-[#3A2400] drop-shadow-[2px_2px_0_#FFDB9E] hover:scale-105 transition-transform"
          >
            Dietetic&#8722;Shop
          </a>
        </nav>

        {/* Contenido principal del formulario */}
        <main className="area-principal flex-1 flex items-center justify-center p-4 py-8">
          <div className="tarjeta-formulario w-full max-w-[500px] bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center my-auto">
            {/* Imagen decorativa */}
            {mostrarImagen && (
              <div className="contenedor-imagen mb-6">
                <img
                  src="/imgs/deco/fruto-seco-login.webp"
                  alt="Decoración fruto seco"
                  className="imagen-decorativa w-20 mx-auto animate-bounce"
                />
              </div>
            )}

            {/* Título principal */}
            <div className="encabezado-formulario mb-8">
              <h1 className="titulo-principal text-3xl font-bold text-[#C2410C] mb-2">
                {titulo}
              </h1>
              {subtitulo && (
                <p className="subtitulo text-gray-600 text-sm">{subtitulo}</p>
              )}
            </div>

            {/* Contenido del formulario */}
            <div className="contenido-formulario">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormContainer;
