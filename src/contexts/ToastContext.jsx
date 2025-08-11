import { createContext, useCallback, useContext, useState } from 'react';

// Crear el contexto
const ToastContext = createContext();

// Proveedor del contexto
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const mostrarToast = useCallback((mensaje, tipo = 'info', duracion = 3000) => {
    const id = Date.now() + Math.random();
    const nuevoToast = {
      id,
      mensaje,
      tipo,
      duracion,
      visible: true
    };

    setToasts(prev => [...prev, nuevoToast]);

    // Auto-eliminar después de la duración
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duracion);

    return id;
  }, []);

  const cerrarToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const mostrarExito = useCallback((mensaje, duracion = 3000) => {
    return mostrarToast(mensaje, 'success', duracion);
  }, [mostrarToast]);

  const mostrarError = useCallback((mensaje, duracion = 4000) => {
    return mostrarToast(mensaje, 'error', duracion);
  }, [mostrarToast]);

  const mostrarAdvertencia = useCallback((mensaje, duracion = 4000) => {
    return mostrarToast(mensaje, 'warning', duracion);
  }, [mostrarToast]);

  const mostrarInfo = useCallback((mensaje, duracion = 3000) => {
    return mostrarToast(mensaje, 'info', duracion);
  }, [mostrarToast]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        mostrarToast,
        mostrarExito,
        mostrarError,
        mostrarAdvertencia,
        mostrarInfo,
        cerrarToast
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  return context;
};
