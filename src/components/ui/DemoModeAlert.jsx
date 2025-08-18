// components/ui/DemoModeAlert.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const DemoModeAlert = () => {
  const [isDemo, setIsDemo] = useState(false);
  const { checkDemoMode } = useAuth();
  
  useEffect(() => {
    // Verificar si el backend está en modo demo usando la función del contexto
    const verificarModoDemo = async () => {
      try {
        const isDemoMode = await checkDemoMode();
        setIsDemo(isDemoMode);
      } catch (error) {
        // Fallback: intentar con el endpoint health
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL.replace('/api', '')}/health`);
          const data = await response.json();
          setIsDemo(data.demoMode === 'Activo');
        } catch (fallbackError) {
          // Error silencioso
        }
      }
    };

    verificarModoDemo();
  }, [checkDemoMode]);

  if (!isDemo) return null;

  return (
    <div className="w-full bg-amber-500 text-white text-center py-1.5 z-40 shadow-sm">
      <p className="text-xs font-medium">
        🧪 <span className="font-bold">MODO DEMOSTRACIÓN</span> - Las operaciones no afectan la base de datos real
      </p>
    </div>
  );
};

export default DemoModeAlert;
