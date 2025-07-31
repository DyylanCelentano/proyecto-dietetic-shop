import { useEffect, useState } from 'react';

const Toast = ({ 
  mensaje, 
  tipo = 'info', 
  duracion = 5000, 
  visible = false, 
  onCerrar 
}) => {
  const [mostrar, setMostrar] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMostrar(true);
      const timer = setTimeout(() => {
        setMostrar(false);
        if (onCerrar) onCerrar();
      }, duracion);

      return () => clearTimeout(timer);
    }
  }, [visible, duracion, onCerrar]);

  const obtenerEstilos = () => {
    const estilosBase = "fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4 transform transition-all duration-300 ease-in-out";
    
    const estilosTipo = {
      success: "border-green-500 bg-green-50",
      error: "border-red-500 bg-red-50", 
      warning: "border-yellow-500 bg-yellow-50",
      info: "border-blue-500 bg-blue-50"
    };

    const estilosVisibilidad = mostrar 
      ? "translate-x-0 opacity-100" 
      : "translate-x-full opacity-0";

    return `${estilosBase} ${estilosTipo[tipo]} ${estilosVisibilidad}`;
  };

  const obtenerIcono = () => {
    const iconos = {
      success: "fas fa-check-circle text-green-500",
      error: "fas fa-exclamation-circle text-red-500",
      warning: "fas fa-exclamation-triangle text-yellow-500", 
      info: "fas fa-info-circle text-blue-500"
    };
    return iconos[tipo];
  };

  const obtenerTitulo = () => {
    const titulos = {
      success: "¡Éxito!",
      error: "Error",
      warning: "Advertencia",
      info: "Información"
    };
    return titulos[tipo];
  };

  if (!mostrar) return null;

  return (
    <div className={obtenerEstilos()}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <i className={`${obtenerIcono()} text-xl`}></i>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {obtenerTitulo()}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {mensaje}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => {
              setMostrar(false);
              if (onCerrar) onCerrar();
            }}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>
      </div>
      
      {/* Barra de progreso */}
      <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
        <div 
          className="bg-gray-400 h-1 rounded-full transition-all duration-300"
          style={{ 
            width: mostrar ? '100%' : '0%',
            transition: `width ${duracion}ms linear`
          }}
        ></div>
      </div>
    </div>
  );
};

export default Toast; 