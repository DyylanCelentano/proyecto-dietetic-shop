// components/ui/DemoModeAlert.jsx
import { useEffect, useState } from 'react';

const DemoModeAlert = () => {
  const [isDemo, setIsDemo] = useState(false);
  
  useEffect(() => {
    // Verificar si el backend está en modo demo
    fetch(`${import.meta.env.VITE_API_URL.replace('/api', '')}/health`)
      .then(response => response.json())
      .then(data => {
        setIsDemo(data.demoMode === 'Activo');
      })
      .catch(error => {
        console.error('Error al verificar modo demo:', error);
      });
  }, []);

  if (!isDemo) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white text-center py-2 z-50">
      <p className="text-sm font-medium">
        📢 <span className="font-bold">MODO DEMOSTRACIÓN</span> - Los cambios no afectan la base de datos real
      </p>
    </div>
  );
};

export default DemoModeAlert;
