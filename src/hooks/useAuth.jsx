import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage al cargar la app
    const usuarioGuardado = localStorage.getItem('usuario');
    const tokenGuardado = localStorage.getItem('token');
    
    if (usuarioGuardado && tokenGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
      }
    }
    
    setCargando(false);
  }, []);

  const iniciarSesion = (datosUsuario, token) => {
    setUsuario(datosUsuario);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
    localStorage.setItem('token', token);
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  const actualizarUsuario = (nuevosDatos) => {
    setUsuario(nuevosDatos);
    localStorage.setItem('usuario', JSON.stringify(nuevosDatos));
  };

  const valor = {
    usuario,
    cargando,
    iniciarSesion,
    cerrarSesion,
    actualizarUsuario,
    estaAutenticado: !!usuario
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
}; 