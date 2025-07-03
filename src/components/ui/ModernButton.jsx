
const ModernButton = ({
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
  const estilosBase = `
    boton-moderno inline-flex items-center justify-center font-medium
    rounded-lg transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    transform active:scale-95
  `;

  const variantes = {
    primary: `
      boton-primario-moderno bg-gradient-to-r from-[#D3B178] to-[#815100]
      text-[#3A2400] border border-transparent font-['Gabarito'] font-semibold
      hover:from-[#b39869] hover:to-[#5E3B00] hover:shadow-lg hover:text-white
      focus:ring-[#815100]
      shadow-md hover:shadow-lg
    `,
    secondary: `
      boton-secundario-moderno bg-[#FFF8ED] text-[#3A2400] border border-[#D3B178] font-['Gabarito']
      hover:bg-[#D3B178] hover:border-[#815100] hover:text-white
      focus:ring-[#815100]
    `,
    outline: `
      boton-outline-moderno bg-transparent text-[#815100] border border-[#D3B178] font-['Gabarito']
      hover:bg-[#FFF8ED] hover:border-[#815100]
      focus:ring-[#815100]
    `,
  };

  const tamanos = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-6 py-3 md:px-8 md:py-4 text-base md:text-lg",
  };

  const clasesFinal = `
    ${estilosBase}
    ${variantes[variant]}
    ${tamanos[size]}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clasesFinal}
      {...props}
    >
      {loading ? (
        <div className="contenedor-loading-moderno flex items-center">
          <div className="spinner-moderno w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default ModernButton;
