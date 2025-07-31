import Toast from './Toast';

const ToastContainer = ({ toasts, onCerrar }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          mensaje={toast.mensaje}
          tipo={toast.tipo}
          duracion={toast.duracion}
          visible={toast.visible}
          onCerrar={() => onCerrar(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer; 