import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

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
    const usuarioGuardado = localStorage.getItem('usuario');
    const tokenGuardado = localStorage.getItem('token');
    
    if (usuarioGuardado && tokenGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenGuardado}`;
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
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
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
    estaAutenticado: !!usuario,
    esAdmin: usuario?.rol === 'admin' 
  };

  return (
    <AuthContext.Provider value={valor}>
      {children}
    </AuthContext.Provider>
  );
};