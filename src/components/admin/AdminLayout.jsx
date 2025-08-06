import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    
    // Referencias para los dropdowns
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);

    // Alertas simuladas
    const [alertas] = useState([
        {
            id: 1,
            tipo: 'stock',
            titulo: 'Stock Bajo',
            mensaje: '5 productos con stock menor a 10 unidades',
            ruta: '/admin/productos?filtro=stock-bajo',
            icono: '📦',
            color: 'text-yellow-600'
        },
        {
            id: 2,
            tipo: 'pedidos',
            titulo: 'Pedidos Pendientes',
            mensaje: '8 pedidos esperando confirmación',
            ruta: '/admin/pedidos?estado=pendiente',
            icono: '📋',
            color: 'text-blue-600'
        },
        {
            id: 3,
            tipo: 'usuarios',
            titulo: 'Nuevos Usuarios',
            mensaje: '12 usuarios registrados hoy',
            ruta: '/admin/usuarios?filtro=nuevos',
            icono: '👥',
            color: 'text-green-600'
        }
    ]);

    // Cerrar dropdowns al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
    };

    const manejarAlerta = (ruta) => {
        navigate(ruta);
        setNotificationsOpen(false);
    };

    return (
        <div className="min-h-screen bg-[#FFF8ED] flex">
            {/* Sidebar */}
            <AdminSidebar 
                isOpen={sidebarOpen} 
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                currentPath={location.pathname}
            />

            {/* Contenido Principal */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-[#D3B178] px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Botón móvil para sidebar */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-md text-[#3A2400] hover:bg-[#FFF1D9] transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Logo y título */}
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:block">
                                <h1 className="text-xl font-['Epilogue'] font-bold text-[#3A2400]">
                                    🥗 Dietetic-Shop Admin
                                </h1>
                            </div>
                        </div>

                        {/* Usuario y notificaciones */}
                        <div className="flex items-center space-x-4">
                            {/* Notificaciones */}
                            <div className="relative" ref={notificationRef}>
                                <button 
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="relative p-2 text-[#3A2400] hover:bg-[#FFF1D9] rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {alertas.length}
                                    </span>
                                </button>

                                {/* Dropdown de notificaciones */}
                                {notificationsOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-[#D3B178] py-2 z-50">
                                        <div className="px-4 py-2 border-b border-[#D3B178]">
                                            <h3 className="font-['Epilogue'] font-semibold text-[#3A2400]">
                                                Alertas Importantes
                                            </h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {alertas.map(alerta => (
                                                <button
                                                    key={alerta.id}
                                                    onClick={() => manejarAlerta(alerta.ruta)}
                                                    className="w-full px-4 py-3 text-left hover:bg-[#FFF1D9] transition-colors border-b border-[#FFF1D9] last:border-b-0"
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <span className="text-xl">{alerta.icono}</span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`font-['Gabarito'] font-medium ${alerta.color}`}>
                                                                {alerta.titulo}
                                                            </p>
                                                            <p className="text-sm text-[#4D3000] truncate">
                                                                {alerta.mensaje}
                                                            </p>
                                                        </div>
                                                        <svg className="w-4 h-4 text-[#4D3000] mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Perfil del usuario */}
                            <div className="flex items-center space-x-3">
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-['Gabarito'] font-medium text-[#3A2400]">
                                        {user?.nombre || 'Administrador'}
                                    </p>
                                    <p className="text-xs text-[#4D3000]">
                                        {user?.email || 'admin@dietetic-shop.com'}
                                    </p>
                                </div>
                                
                                {/* Avatar */}
                                <div className="w-10 h-10 bg-[#D3B178] rounded-full flex items-center justify-center">
                                    <span className="text-[#3A2400] font-['Gabarito'] font-semibold">
                                        {user?.nombre?.charAt(0) || 'A'}
                                    </span>
                                </div>

                                {/* Menú desplegable */}
                                <div className="relative" ref={dropdownRef}>
                                    <button 
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="p-1 text-[#3A2400] hover:bg-[#FFF1D9] rounded transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {/* Dropdown menu */}
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#D3B178] py-1 z-50">
                                            <Link
                                                to="/admin/configuracion"
                                                className="block px-4 py-2 text-sm text-[#3A2400] hover:bg-[#FFF1D9] transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                ⚙️ Configuración
                                            </Link>
                                            <Link
                                                to="/"
                                                className="block px-4 py-2 text-sm text-[#3A2400] hover:bg-[#FFF1D9] transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                🏠 Ir al Sitio
                                            </Link>
                                            <hr className="my-1 border-[#D3B178]" />
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setDropdownOpen(false);
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                🚪 Cerrar Sesión
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Contenido */}
                <main className="flex-1 overflow-auto">
                    {children}
                </main>
            </div>

            {/* Overlay para móvil */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminLayout; 