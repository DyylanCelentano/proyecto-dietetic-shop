import { useState } from "react";


const ModernInput = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  error = "",
  icon = "",
  ...props
}) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const tipoInput = type === "password" && mostrarPassword ? "text" : type;

  const getIcon = () => {
    switch (icon || type) {
      case "email":
        return (
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
            />
          </svg>
        );
      case "password":
        return (
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        );
      case "user":
      case "text":
        return (
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="campo-moderno mb-4 md:mb-0">
      {label && (
        <label className="etiqueta-moderna block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="contenedor-input-moderno relative">
        {/* Icono derecho */}
        <div className="icono-input absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
          {getIcon()}
        </div>

        <input
          type={tipoInput}
          name={name}
          value={value}
          onChange={onChange}

          className={`
            input-moderno w-full pl-4 pr-10 py-3 md:py-3.5
            bg-[#FFF8ED] border border-[#D3B178] rounded-lg
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-[#815100] focus:bg-white focus:border-[#815100]
            hover:bg-white hover:border-[#b39869]
            text-[#3A2400] placeholder-[#5E3B00]/60 font-['Gabarito'] text-sm md:text-base
            ${error ? "ring-2 ring-red-400 bg-red-50 border-red-400" : ""}
          `}
          placeholder={placeholder}
          required={required}
          {...props}
        />

        {/* Botón mostrar/ocultar contraseña */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="boton-toggle-password absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-20"
          >
            {mostrarPassword ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mensaje-error-moderno text-red-500 text-xs mt-1 animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};

export default ModernInput;
