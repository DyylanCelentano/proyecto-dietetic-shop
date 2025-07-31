import { useState } from 'react'

// Hook personalizado para manejar notificaciones
export const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([])

  const agregarNotificacion = (mensaje, tipo = 'info', duracion = 5000) => {
    const id = Date.now() + Math.random()
    const nuevaNotificacion = {
      id,
      mensaje,
      tipo,
      duracion
    }

    setNotificaciones(prev => [...prev, nuevaNotificacion])

    // Auto-remover después de la duración especificada
    setTimeout(() => {
      removerNotificacion(id)
    }, duracion + 300) // +300ms para la animación
  }

  const removerNotificacion = (id) => {
    setNotificaciones(prev => prev.filter(notif => notif.id !== id))
  }

  const limpiarNotificaciones = () => {
    setNotificaciones([])
  }

  // Métodos de conveniencia
  const mostrarExito = (mensaje, duracion) => agregarNotificacion(mensaje, 'exito', duracion)
  const mostrarError = (mensaje, duracion) => agregarNotificacion(mensaje, 'error', duracion)
  const mostrarAdvertencia = (mensaje, duracion) => agregarNotificacion(mensaje, 'advertencia', duracion)
  const mostrarInfo = (mensaje, duracion) => agregarNotificacion(mensaje, 'info', duracion)

  return {
    notificaciones,
    agregarNotificacion,
    removerNotificacion,
    limpiarNotificaciones,
    mostrarExito,
    mostrarError,
    mostrarAdvertencia,
    mostrarInfo
  }
}