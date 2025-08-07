import Toast from './Toast';

const ToastContainer = ({ toasts, onCerrar }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            mensaje={toast.mensaje}
            tipo={toast.tipo}
            duracion={toast.duracion}
            visible={toast.visible}
            onCerrar={() => onCerrar(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer; 