
const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  onClick,
  children,
  type = "button",
  className = "",
  ...props
}) => {
  // Estilos base del botón
  const estilosBase = `
    boton-base inline-flex items-center justify-center font-semibold 
    rounded-lg border-2 transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transform hover:scale-[1.02] active:scale-[0.98]
  `

  // Variantes de color y estilo
  const variantes = {
    primary: `
      boton-primario bg-orange-600 border-orange-900 text-white 
      hover:bg-orange-700 hover:border-orange-950
      focus:ring-orange-200
    `,
    secondary: `
      boton-secundario bg-orange-200 border-orange-600 text-orange-900 
      hover:bg-orange-300 hover:text-orange-950
      focus:ring-orange-100
    `,
    outline: `
      boton-outline bg-transparent border-orange-600 text-orange-600 
      hover:bg-orange-50 hover:text-orange-700
      focus:ring-orange-100
    `,
    google: `
      boton-google bg-white border-gray-300 text-gray-700 
      hover:bg-gray-50 hover:border-gray-400
      focus:ring-gray-100
    `,
  }

  // Tamaños del botón
  const tamanos = {
    sm: "texto-pequeno px-3 py-2 text-sm",
    md: "texto-mediano px-6 py-3 text-base",
    lg: "texto-grande px-8 py-4 text-lg",
  }

  const clasesFinal = `
    ${estilosBase} 
    ${variantes[variant]} 
    ${tamanos[size]} 
    ${className}
  `.trim()

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clasesFinal}
      {...props}
    >
      {loading ? (
        <div className="contenedor-loading flex items-center">
          <div className="spinner-loading w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Cargando...
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
