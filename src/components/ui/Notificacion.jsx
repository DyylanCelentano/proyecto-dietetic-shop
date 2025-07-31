import { useEffect, useState } from 'react'

const Notificacion = ({ mensaje, tipo = 'info', duracion = 5000, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onClose && onClose(), 300) // Esperar a que termine la animación
    }, duracion)

    return () => clearTimeout(timer)
  }, [duracion, onClose])

  const obtenerEstilos = () => {
    const base = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform max-w-md"
    
    switch (tipo) {
      case 'exito':
        return `${base} bg-green-50 border-green-500 text-green-800`
      case 'error':
        return `${base} bg-red-50 border-red-500 text-red-800`
      case 'advertencia':
        return `${base} bg-yellow-50 border-yellow-500 text-yellow-800`
      default:
        return `${base} bg-blue-50 border-blue-500 text-blue-800`
    }
  }

  const obtenerIcono = () => {
    switch (tipo) {
      case 'exito':
        return <i className="fas fa-check-circle text-green-500 mr-2"></i>
      case 'error':
        return <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
      case 'advertencia':
        return <i className="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
      default:
        return <i className="fas fa-info-circle text-blue-500 mr-2"></i>
    }
  }

  if (!visible) return null

  return (
    <div className={`${obtenerEstilos()} ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="flex items-start">
        {obtenerIcono()}
        <div className="flex-1">
          <p className="font-medium">{mensaje}</p>
        </div>
        <button
          onClick={() => {
            setVisible(false)
            setTimeout(() => onClose && onClose(), 300)
          }}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  )
}

export default Notificacion