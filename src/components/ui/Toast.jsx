import { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ 
  mensaje, 
  tipo = 'info', 
  duracion = 3000, 
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
    const estilosBase = "w-full max-w-sm rounded-lg shadow-xl border p-4 transform transition-all duration-300 ease-in-out backdrop-blur-sm";
    
    const estilosTipo = {
      success: "border-green-500 bg-green-50/95 text-green-800",
      error: "border-red-500 bg-red-50/95 text-red-800", 
      warning: "border-yellow-500 bg-yellow-50/95 text-yellow-800",
      info: "border-blue-500 bg-blue-50/95 text-blue-800"
    };

    const estilosVisibilidad = mostrar 
      ? "translate-x-0 opacity-100 scale-100" 
      : "translate-x-full opacity-0 scale-95";

    return `${estilosBase} ${estilosTipo[tipo]} ${estilosVisibilidad}`;
  };

  const obtenerIcono = () => {
    const iconos = {
      success: <FaCheckCircle className="text-green-500" />,
      error: <FaExclamationCircle className="text-red-500" />,
      warning: <FaExclamationTriangle className="text-yellow-500" />,
      info: <FaInfoCircle className="text-blue-500" />
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
        <div className="flex-shrink-0 text-lg mt-0.5">
          {obtenerIcono()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-semibold">
            {obtenerTitulo()}
          </p>
          <p className="mt-0.5 text-sm opacity-90">
            {mensaje}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => {
              setMostrar(false);
              if (onCerrar) onCerrar();
            }}
            className="inline-flex text-gray-500 hover:text-gray-700 focus:outline-none transition-colors rounded p-1 hover:bg-white/50"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>
      </div>
      
      {/* Barra de progreso */}
      <div className="mt-3 w-full bg-black/10 rounded-full h-0.5">
        <div 
          className="h-0.5 rounded-full transition-all duration-300 bg-current opacity-30"
          style={{ 
            width: mostrar ? '0%' : '100%',
            transition: `width ${duracion}ms linear`
          }}
        ></div>
      </div>
    </div>
  );
};

export default Toast; 