const Cargando = ({ mensaje = 'Cargando...', tamaño = 'mediano' }) => {
  const obtenerTamaño = () => {
    switch (tamaño) {
      case 'pequeño':
        return 'w-6 h-6'
      case 'grande':
        return 'w-12 h-12'
      default:
        return 'w-8 h-8'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${obtenerTamaño()} border-4 border-[#D3B178] border-t-[#5E3B00] rounded-full animate-spin mb-4`}></div>
      <p className="text-[#5E3B00] font-['Gabarito'] font-medium">{mensaje}</p>
    </div>
  )
}

export default Cargando