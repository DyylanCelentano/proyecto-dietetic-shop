import { Link } from 'react-router-dom';

const AccesosRapidos = ({ horizontal = false }) => {
    const accesos = [
        {
            id: 1,
            titulo: 'Agregar Producto',
            descripcion: 'Crear nuevo producto',
            icono: '➕',
            color: 'bg-green-100 border-green-300',
            ruta: '/admin/productos/nuevo'
        },
        {
            id: 2,
            titulo: 'Ver Pedidos',
            descripcion: 'Gestionar pedidos',
            icono: '📦',
            color: 'bg-blue-100 border-blue-300',
            ruta: '/admin/pedidos'
        },
        {
            id: 3,
            titulo: 'Reportes',
            descripcion: 'Ver estadísticas',
            icono: '📊',
            color: 'bg-purple-100 border-purple-300',
            ruta: '/admin/finanzas'
        },
        {
            id: 4,
            titulo: 'Usuarios',
            descripcion: 'Gestionar clientes',
            icono: '👥',
            color: 'bg-orange-100 border-orange-300',
            ruta: '/admin/usuarios'
        },
        {
            id: 5,
            titulo: 'Configuración',
            descripcion: 'Ajustes del sistema',
            icono: '⚙️',
            color: 'bg-gray-100 border-gray-300',
            ruta: '/admin/configuracion'
        },
        {
            id: 6,
            titulo: 'Inventario',
            descripcion: 'Control de stock',
            icono: '📋',
            color: 'bg-yellow-100 border-yellow-300',
            ruta: '/admin/productos'
        }
    ];

    const estadisticasRapidas = [
        { titulo: 'Pedidos Hoy', valor: '12', icono: '📦', color: 'text-blue-600' },
        { titulo: 'Stock Crítico', valor: '5', icono: '⚠️', color: 'text-red-600' },
        { titulo: 'Nuevos Usuarios', valor: '8', icono: '👥', color: 'text-green-600' },
        { titulo: 'Ventas Mes', valor: '$342K', icono: '💰', color: 'text-purple-600' }
    ];

    return (
        <div className="space-y-6">
            {/* Accesos Rápidos */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178]">
                <h3 className="text-lg font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                    🚀 Accesos Rápidos
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {accesos.map((acceso) => (
                        <Link
                            key={acceso.id}
                            to={acceso.ruta}
                            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${acceso.color} hover:scale-105`}
                        >
                            <div className="text-center">
                                <div className="text-2xl mb-2">{acceso.icono}</div>
                                <h4 className="text-sm font-['Gabarito'] font-medium text-[#3A2400] mb-1">
                                    {acceso.titulo}
                                </h4>
                                <p className="text-xs text-[#4D3000] opacity-75">
                                    {acceso.descripcion}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[#D3B178]">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-['Gabarito'] text-[#4D3000]">
                            Funciones más utilizadas
                        </span>
                        <Link 
                            to="/admin/configuracion"
                            className="text-xs text-[#815100] hover:text-[#3A2400] transition-colors font-['Gabarito']"
                        >
                            Personalizar →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Estadísticas Rápidas - Solo en vista vertical */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178] lg:grid lg:grid-cols-4 lg:gap-4">
                <div className="lg:col-span-4 mb-4 lg:mb-2">
                    <h3 className="text-lg font-['Epilogue'] font-semibold text-[#3A2400]">
                        📈 Vista Rápida
                    </h3>
                </div>

                {estadisticasRapidas.map((stat, index) => (
                    <div key={index} className="bg-[#FFF8ED] rounded-lg p-3 border border-[#D3B178] mb-3 lg:mb-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-['Gabarito'] text-[#4D3000] opacity-75">
                                    {stat.titulo}
                                </p>
                                <p className={`text-lg font-['Epilogue'] font-bold ${stat.color}`}>
                                    {stat.valor}
                                </p>
                            </div>
                            <span className="text-xl">{stat.icono}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actividad Reciente - Solo mostrar en dispositivos grandes */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178] hidden lg:block">
                <h3 className="text-lg font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                    🕒 Actividad Reciente
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-3 p-2 bg-[#FFF8ED] rounded-lg">
                        <span className="text-green-600">✅</span>
                        <div className="flex-1">
                            <p className="text-sm font-['Gabarito'] text-[#3A2400]">Nuevo pedido #1234</p>
                            <p className="text-xs text-[#4D3000] opacity-75">Hace 5 minutos</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-2 bg-[#FFF8ED] rounded-lg">
                        <span className="text-blue-600">📦</span>
                        <div className="flex-1">
                            <p className="text-sm font-['Gabarito'] text-[#3A2400]">Producto actualizado</p>
                            <p className="text-xs text-[#4D3000] opacity-75">Hace 15 minutos</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-2 bg-[#FFF8ED] rounded-lg">
                        <span className="text-orange-600">👤</span>
                        <div className="flex-1">
                            <p className="text-sm font-['Gabarito'] text-[#3A2400]">Nuevo usuario registrado</p>
                            <p className="text-xs text-[#4D3000] opacity-75">Hace 30 minutos</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#D3B178] text-center">
                    <Link 
                        to="/admin/actividad"
                        className="text-sm text-[#815100] hover:text-[#3A2400] transition-colors font-['Gabarito']"
                    >
                        Ver toda la actividad →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AccesosRapidos; 