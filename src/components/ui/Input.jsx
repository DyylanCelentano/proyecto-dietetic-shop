import { useState } from "react";


const Input = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  label,
  required = false,
  mostrarContrasena = false,
  error = "",
  ...props
}) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const tipoInput =
    type === "password" && mostrarContrasena
      ? mostrarPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="espacio-campo text-left space-y-2">
      {label && (
        <label className="bloque-etiqueta block text-gray-700 font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="contenedor-input relative">
        <input
          type={tipoInput}
          name={name}
          value={value}
          onChange={onChange}
          className={`
            input-principal w-full rounded-lg border-[1px] px-3 py-3 
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-orange-200
            ${
              error
                ? "border-red-500 focus:border-red-600"
                : "border-[#D6B08C] focus:border-orange-600"
            }
            ${type === "password" && mostrarContrasena ? "pr-12" : ""}
          `}
          placeholder={placeholder}
          required={required}
          {...props}
        />

        {type === "password" && mostrarContrasena && (
          <button
            type="button"
            onClick={() => setMostrarPassword(!mostrarPassword)}
            className="boton-mostrar-password absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <i
              className={`fas ${mostrarPassword ? "fa-eye-slash" : "fa-eye"}`}
            ></i>
          </button>
        )}
      </div>

      {error && (
        <p className="mensaje-error text-red-500 text-sm mt-1 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
