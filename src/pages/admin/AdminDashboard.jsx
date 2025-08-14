import { useEffect, useState } from 'react'
import AccesosRapidos from '../../components/admin/AccesosRapidos'
import AdminLayout from '../../components/admin/AdminLayout'
import AlertasPanel from '../../components/admin/AlertasPanel'
import ChartComponent from '../../components/admin/ChartComponent'
import StatsCard from '../../components/admin/StatsCard'
import { BagIcon, ChartIcon, MoneyIcon, PackageIcon, UsersIcon, WarningIcon } from '../../components/icons/Icons'
import useAdmin from '../../hooks/useAdmin'
import { useAuth } from '../../hooks/useAuth'

const AdminDashboard = () => {
    const { usuario, estaAutenticado, esAdmin } = useAuth()
    const { 
        loading, 
        error, 
        obtenerEstadisticas, 
        obtenerDatosVentas,
        verificarPermisos 
    } = useAdmin()
    
    const [stats, setStats] = useState({
        ventasHoy: 0,
        ventasMes: 0,
        productosVendidos: 0,
        usuariosRegistrados: 0,
        pedidosPendientes: 0,
        stockBajo: 0
    })
    const [datosVentas, setDatosVentas] = useState([])
    const [datosInicializados, setDatosInicializados] = useState(false)

    useEffect(() => {
        if (!esAdmin || !estaAutenticado || datosInicializados) {
            return
        }

        const cargarDatos = async () => {
            try {
                // Cargar estadísticas
                const statsData = await obtenerEstadisticas()
                setStats(statsData.data)

                // Cargar datos de ventas
                const ventasData = await obtenerDatosVentas('7dias')
                setDatosVentas(ventasData.data)
                
                setDatosInicializados(true)
            } catch (err) {
                console.error('Error cargando datos del dashboard:', err)
            }
        }

        cargarDatos()
    }, [esAdmin, estaAutenticado, datosInicializados, obtenerEstadisticas, obtenerDatosVentas]) // Solo dependemos de los estados de autenticación

    if (!estaAutenticado) {
        return (
            <div className="min-h-screen bg-[#FFF8ED] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-['Epilogue'] text-[#3A2400] mb-4">
                        Acceso Denegado
                    </h2>
                    <p className="text-[#4D3000]">
                        Debes iniciar sesión para acceder al panel administrativo.
                    </p>
                </div>
            </div>
        )
    }

    if (!esAdmin) {
        return (
            <div className="min-h-screen bg-[#FFF8ED] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-['Epilogue'] text-[#3A2400] mb-4">
                        Permisos Insuficientes
                    </h2>
                    <p className="text-[#4D3000]">
                        No tienes permisos de administrador para acceder a esta sección.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <AdminLayout>
            <div className="p-6 space-y-6 bg-white">
                {/* Header del Dashboard */}
                <div className="mb-8">
                    <h1 className="text-3xl font-['Epilogue'] font-bold text-[#3A2400] mb-2">
                        Panel Administrativo
                    </h1>
                    <p className="text-[#4D3000] font-['Gabarito']">
                        Bienvenido, {usuario.username}. Aquí tienes un resumen de tu tienda.
                    </p>
                </div>

                {/* Cards de Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                    <StatsCard
                        titulo="Ventas Hoy"
                        valor={`$${stats.ventasHoy.toLocaleString('es-AR')}`}
                        icono={<MoneyIcon className="w-6 h-6 text-brand-primary" />}
                        color="bg-green-100 border-green-300"
                        loading={loading}
                    />
                    <StatsCard
                        titulo="Ventas del Mes"
                        valor={`$${stats.ventasMes.toLocaleString('es-AR')}`}
                        icono={<ChartIcon className="w-6 h-6 text-brand-primary" />}
                        color="bg-blue-100 border-blue-300"
                        loading={loading}
                    />
                    <StatsCard
                        titulo="Productos Vendidos"
                        valor={stats.productosVendidos}
                        icono={<BagIcon className="w-6 h-6 text-brand-primary" />}
                        color="bg-purple-100 border-purple-300"
                        loading={loading}
                    />
                    <StatsCard
                        titulo="Usuarios Registrados"
                        valor={stats.usuariosRegistrados}
                        icono={<UsersIcon className="w-6 h-6 text-brand-primary" />}
                        color="bg-orange-100 border-orange-300"
                        loading={loading}
                    />
                    <StatsCard
                        titulo="Pedidos Pendientes"
                        valor={stats.pedidosPendientes}
                        icono={<PackageIcon className="w-6 h-6 text-brand-primary" />}
                        color="bg-yellow-100 border-yellow-300"
                        loading={loading}
                    />
                    <StatsCard
                        titulo="Stock Bajo"
                        valor={stats.stockBajo}
                        icono={<WarningIcon className="w-6 h-6 text-brand-primary" />}
                        color="bg-red-100 border-red-300"
                        loading={loading}
                    />
                </div>

                {/* Gráficos y Contenido Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Gráfico de Ventas */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#FFF8ED] rounded-lg shadow-md p-4 sm:p-6 border border-[#D3B178] overflow-x-auto">
                            <h3 className="text-lg sm:text-xl font-['Epilogue'] font-semibold text-[#3A2400] mb-2 sm:mb-4">
                                Ventas de los Últimos 7 Días
                            </h3>
                            <div className="min-w-[300px]">
                                <ChartComponent
                                    tipo="linea"
                                    datos={datosVentas}
                                    loading={loading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Panel de Alertas */}
                    <div>
                        <AlertasPanel loading={loading} />
                    </div>
                </div>

                {/* Accesos Rápidos Horizontales */}
                <div className="mt-6">
                    <AccesosRapidos />
                </div>

                {/* Mensaje de Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 font-['Gabarito']">
                            Error: {error}
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminDashboard 