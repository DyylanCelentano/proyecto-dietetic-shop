import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ isOpen, onToggle, currentPath }) => {
    const menuItems = [
        {
            path: '/admin',
            icon: '📊',
            label: 'Dashboard General',
            description: 'Resumen y métricas'
        },
        {
            path: '/admin/productos',
            icon: '🛍️',
            label: 'Gestión de Productos',
            description: 'CRUD de productos'
        },
        {
            path: '/admin/finanzas',
            icon: '💰',
            label: 'Finanzas y Analytics',
            description: 'Estadísticas avanzadas'
        },
        {
            path: '/admin/pedidos',
            icon: '📦',
            label: 'Gestión de Pedidos',
            description: 'Estado y seguimiento'
        },
        {
            path: '/admin/usuarios',
            icon: '👥',
            label: 'Gestión de Usuarios',
            description: 'Clientes registrados'
        },
        {
            path: '/admin/configuracion',
            icon: '⚙️',
            label: 'Configuración',
            description: 'Ajustes generales'
        }
    ];

    return (
        <>
            {/* Sidebar para desktop */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-[#D3B178] 
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Header del sidebar */}
                <div className="flex items-center justify-between p-6 border-b border-[#D3B178]">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#D3B178] rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🥗</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-['Epilogue'] font-bold text-[#3A2400]">
                                Admin Panel
                            </h2>
                            <p className="text-xs text-[#4D3000] font-['Gabarito']">
                                Panel Administrativo
                            </p>
                        </div>
                    </div>
                    
                    {/* Botón cerrar en móvil */}
                    <button
                        onClick={onToggle}
                        className="lg:hidden p-2 text-[#3A2400] hover:bg-[#FFF1D9] rounded-md transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navegación */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = currentPath === item.path;
                        
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                                    ${isActive 
                                        ? 'bg-[#FFF1D9] border-l-4 border-[#815100] text-[#3A2400]' 
                                        : 'text-[#4D3000] hover:bg-[#FFF1D9] hover:text-[#3A2400]'
                                    }
                                `}
                                onClick={() => {
                                    // Cerrar sidebar en móvil al hacer clic
                                    if (window.innerWidth < 1024) {
                                        onToggle();
                                    }
                                }}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <div className="flex-1">
                                    <p className={`font-['Gabarito'] font-medium ${isActive ? 'text-[#3A2400]' : ''}`}>
                                        {item.label}
                                    </p>
                                    <p className="text-xs opacity-75">
                                        {item.description}
                                    </p>
                                </div>
                                {isActive && (
                                    <div className="w-2 h-2 bg-[#815100] rounded-full"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer del sidebar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#D3B178] bg-[#FFF8ED]">
                    <div className="text-center">
                        <p className="text-xs text-[#4D3000] font-['Gabarito']">
                            Versión 1.0.0
                        </p>
                        <p className="text-xs text-[#815100] mt-1">
                            🥗 Dietetic-Shop
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar; 