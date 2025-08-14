import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import ChartComponent from '../../components/admin/ChartComponent'
import StatsCard from '../../components/admin/StatsCard'
import VentasPorCategoria from '../../components/admin/VentasPorCategoria'
import { BagIcon, ChartIcon, MoneyIcon, UsersIcon } from '../../components/icons/Icons'
import useAdmin from '../../hooks/useAdmin'
import { useAuth } from '../../hooks/useAuth'

const AdminFinanzas = () => {
    const { usuario, estaAutenticado, esAdmin } = useAuth()
    const { loading, error } = useAdmin()
    
    const [estadisticas, setEstadisticas] = useState({
        ventasHoy: 0,
        ventasSemana: 0,
        ventasMes: 0,
        ventasAno: 0,
        ticketPromedio: 0,
        clientesActivos: 0,
        productosMasVendidos: [],
        categoriasMasVendidas: []
    })
    
    const [periodo, setPeriodo] = useState('mes')
    const [rangoPersonalizado, setRangoPersonalizado] = useState({ desde: '', hasta: '' })
    const [datosGraficos, setDatosGraficos] = useState({
        ventasPorDia: [],
        ventasPorCategoria: [],
        productosMasVendidos: []
    })
    
    const [comparacion, setComparacion] = useState({
        periodoActual: 0,
        periodoAnterior: 0,
        porcentajeCambio: 0
    })

    const [cargando, setCargando] = useState(true)

    // Cargar datos financieros
    const generarSerieDias = (cantidad, base = 12000, variacion = 0.35) => {
        const hoy = new Date()
        return Array.from({ length: cantidad }).map((_, i) => {
            const d = new Date(hoy)
            d.setDate(hoy.getDate() - (cantidad - 1 - i))
            const ruido = 1 + (Math.random() * variacion * 2 - variacion)
            return {
                fecha: d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }),
                ventas: Math.round(base * ruido)
            }
        })
    }

    const simularPorPeriodo = (p) => {
        switch (p) {
            case 'hoy':
                return generarSerieDias(1, 15000)
            case 'semana':
                return generarSerieDias(7, 16000)
            case 'mes':
                return generarSerieDias(30, 14000)
            case 'ano':
                return generarSerieDias(12, 420000).map((d, idx) => ({ ...d, fecha: new Date(new Date().getFullYear(), idx, 1).toLocaleDateString('es-AR', { month: 'short' }) }))
            case 'personalizado': {
                if (rangoPersonalizado.desde && rangoPersonalizado.hasta) {
                    const desde = new Date(rangoPersonalizado.desde)
                    const hasta = new Date(rangoPersonalizado.hasta)
                    const dias = Math.max(1, Math.round((hasta - desde) / 86400000) + 1)
                    return generarSerieDias(dias, 13000)
                }
                return []
            }
            default:
                return generarSerieDias(10)
        }
    }

    const cargarDatosFinancieros = async () => {
        try {
            setCargando(true)
            
            // Simular datos - en producción usar APIs reales
            const datosSimulados = {
                ventasHoy: 15420,
                ventasSemana: 89340,
                ventasMes: 342580,
                ventasAno: 2840600,
                ticketPromedio: 12450,
                clientesActivos: 145,
                productosMasVendidos: [
                    { nombre: 'Almendras Premium', ventas: 245, ingresos: 98000 },
                    { nombre: 'Nueces de California', ventas: 198, ingresos: 79200 },
                    { nombre: 'Semillas de Chía', ventas: 167, ingresos: 50100 },
                    { nombre: 'Quinoa Orgánica', ventas: 134, ingresos: 53600 },
                    { nombre: 'Avena Integral', ventas: 122, ingresos: 24400 }
                ],
                categoriasMasVendidas: [
                    { categoria: 'Frutos Secos', ventas: 186950, porcentaje: 35, productos: 543, color: '#8B5A3C' },
                    { categoria: 'Semillas', ventas: 112140, porcentaje: 21, productos: 324, color: '#D2B48C' },
                    { categoria: 'Cereales', ventas: 90860, porcentaje: 17, productos: 267, color: '#F4A460' },
                    { categoria: 'Legumbres', ventas: 69615, porcentaje: 13, productos: 198, color: '#DEB887' },
                    { categoria: 'Otros', ventas: 75015, porcentaje: 14, productos: 218, color: '#CD853F' }
                ]
            }

            // Ajustar agregados según período seleccionado (simplificado)
            const factor = periodo === 'hoy' ? 0.05 : periodo === 'semana' ? 0.25 : periodo === 'mes' ? 1 : periodo === 'ano' ? 12 : 0.4
            setEstadisticas(prev => ({
                ...datosSimulados,
                ventasHoy: Math.round(datosSimulados.ventasHoy * (factor * 0.2 + 0.8)),
                ventasSemana: Math.round(datosSimulados.ventasSemana * (factor * 0.4 + 0.6)),
                ventasMes: Math.round(datosSimulados.ventasMes * factor),
                ventasAno: Math.round(datosSimulados.ventasAno * (periodo === 'ano' ? 1 : factor)),
                ticketPromedio: Math.round(datosSimulados.ticketPromedio * (0.9 + Math.random() * 0.2)),
                clientesActivos: Math.round(datosSimulados.clientesActivos * (0.7 + Math.random() * 0.6))
            }))

            // Datos para gráficos
            const graficos = {
                ventasPorDia: simularPorPeriodo(periodo),
                ventasPorCategoria: datosSimulados.categoriasMasVendidas.map(c => ({
                    ...c,
                    ventas: Math.round(c.ventas * (0.7 + Math.random() * 0.6))
                })),
                productosMasVendidos: datosSimulados.productosMasVendidos.map(p => ({
                    ...p,
                    ventas: Math.round(p.ventas * (0.7 + Math.random() * 0.6)),
                    ingresos: Math.round(p.ingresos * (0.7 + Math.random() * 0.6))
                }))
            }

            setDatosGraficos(graficos)

            // Comparación con período anterior
            const actual = periodo === 'hoy' ?  datosSimulados.ventasHoy : periodo === 'semana' ? datosSimulados.ventasSemana : periodo === 'mes' ? datosSimulados.ventasMes : periodo === 'ano' ? datosSimulados.ventasAno : datosSimulados.ventasMes * 0.4
            const anterior = Math.round(actual * (0.7 + Math.random() * 0.2))
            setComparacion({
                periodoActual: actual,
                periodoAnterior: anterior,
                porcentajeCambio: parseFloat((((actual - anterior) / Math.max(1, anterior)) * 100).toFixed(1))
            })

        } catch (error) {
            console.error('Error cargando datos financieros:', error)
        } finally {
            setCargando(false)
        }
    }

    useEffect(() => {
        if (esAdmin) {
            cargarDatosFinancieros()
        }
    }, [esAdmin, periodo])

    // Filtros de fecha
    const periodos = [
        { value: 'hoy', label: 'Hoy' },
        { value: 'semana', label: 'Esta Semana' },
        { value: 'mes', label: 'Este Mes' },
        { value: 'ano', label: 'Este Año' },
        { value: 'personalizado', label: 'Personalizado' }
    ]

    if (!estaAutenticado || !esAdmin) {
        return (
            <div className="min-h-screen bg-[#FFF8ED] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-['Epilogue'] text-[#3A2400] mb-4">
                        Acceso Denegado
                    </h2>
                    <p className="text-[#4D3000]">
                        No tienes permisos para acceder a esta sección.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <AdminLayout>
            <div className="p-6 space-y-6 bg-white">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-['Epilogue'] font-bold text-[#3A2400] mb-2">
                            Finanzas y Analytics
                        </h1>
                        <p className="text-sm sm:text-base text-[#4D3000] font-['Gabarito']">
                            Análisis detallado de ventas y rendimiento
                        </p>
                    </div>
                    
                    {/* Selector de período */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full sm:w-auto">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <label className="text-[#3A2400] font-['Gabarito'] font-medium">Período:</label>
                            <select
                                value={periodo}
                                onChange={(e) => setPeriodo(e.target.value)}
                                className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent font-['Gabarito'] text-sm sm:text-base"
                            >
                                {periodos.map(p => (
                                    <option key={p.value} value={p.value}>{p.label}</option>
                                ))}
                            </select>
                        </div>
                        {periodo === 'personalizado' && (
                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end bg-[#FFF8ED] p-3 sm:p-4 rounded-lg border border-[#D3B178] w-full sm:w-auto">
                                <div className="flex flex-col w-full sm:w-auto">
                                    <label className="text-xs font-semibold text-[#3A2400] mb-1">Desde</label>
                                    <input
                                        type="date"
                                        value={rangoPersonalizado.desde}
                                        onChange={(e) => setRangoPersonalizado(r => ({ ...r, desde: e.target.value }))}
                                        className="w-full sm:w-auto px-2 sm:px-3 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent font-['Gabarito'] text-xs sm:text-sm"
                                    />
                                </div>
                                <div className="flex flex-col w-full sm:w-auto">
                                    <label className="text-xs font-semibold text-[#3A2400] mb-1">Hasta</label>
                                    <input
                                        type="date"
                                        value={rangoPersonalizado.hasta}
                                        onChange={(e) => setRangoPersonalizado(r => ({ ...r, hasta: e.target.value }))}
                                        className="w-full sm:w-auto px-2 sm:px-3 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent font-['Gabarito'] text-xs sm:text-sm"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => cargarDatosFinancieros()}
                                    className="w-full sm:w-auto self-stretch sm:self-auto mt-2 sm:mt-0 px-3 sm:px-4 py-2 bg-[#815100] text-white rounded-lg font-['Gabarito'] text-xs sm:text-sm hover:bg-[#5E3B00] disabled:opacity-50"
                                    disabled={!rangoPersonalizado.desde || !rangoPersonalizado.hasta}
                                >
                                    Aplicar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* KPIs Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        titulo="Ventas Hoy"
                        valor={`$${estadisticas.ventasHoy.toLocaleString('es-AR')}`}
                        icono={<MoneyIcon className="w-6 h-6 text-brand-primary" />}
                        color="bg-green-100 border-green-300"
                        loading={cargando}
                        subtitulo="Ingresos del día"
                    />
                    <StatsCard
                        titulo="Ventas del Mes"
                        valor={`$${estadisticas.ventasMes.toLocaleString('es-AR')}`}
                        icono={<ChartIcon className="w-6 h-6 text-brand-primary" />}
                        color="bg-blue-100 border-blue-300"
                        loading={cargando}
                        subtitulo={`+${comparacion.porcentajeCambio}% vs mes anterior`}
                    />
                    <StatsCard
                        titulo="Ticket Promedio"
                        valor={`$${estadisticas.ticketPromedio.toLocaleString('es-AR')}`}
                        icono={<BagIcon className="w-6 h-6 text-brand-primary" />}
                        color="bg-purple-100 border-purple-300"
                        loading={cargando}
                        subtitulo="Valor promedio por compra"
                    />
                    <StatsCard
                        titulo="Clientes Activos"
                        valor={estadisticas.clientesActivos}
                        icono={<UsersIcon className="w-6 h-6 text-brand-primary" />}
                        color="bg-orange-100 border-orange-300"
                        loading={cargando}
                        subtitulo="Compraron este mes"
                    />
                </div>

                {/* Comparación de Períodos */}
                <div className="bg-[#FFF8ED] rounded-lg shadow-md p-4 sm:p-6 border border-[#D3B178]">
                    <h3 className="text-lg sm:text-xl font-['Epilogue'] font-semibold text-[#3A2400] mb-3 sm:mb-4">
                        Comparación de Rendimiento
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="text-center py-3 px-2 bg-white rounded-lg shadow-sm">
                             <div className="text-xl sm:text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                                 ${comparacion.periodoActual.toLocaleString('es-AR')}
                            </div>
                            <div className="text-sm text-[#4D3000] font-['Gabarito'] mt-1">Período Actual</div>
                        </div>
                        <div className="text-center py-3 px-2 bg-white rounded-lg shadow-sm">
                             <div className="text-xl sm:text-2xl font-['Epilogue'] font-bold text-[#4D3000]">
                                 ${comparacion.periodoAnterior.toLocaleString('es-AR')}
                            </div>
                            <div className="text-sm text-[#4D3000] font-['Gabarito'] mt-1">Período Anterior</div>
                        </div>
                        <div className="text-center py-3 px-2 bg-white rounded-lg shadow-sm">
                            <div className={`text-xl sm:text-2xl font-['Epilogue'] font-bold ${comparacion.porcentajeCambio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {comparacion.porcentajeCambio >= 0 ? '+' : ''}{comparacion.porcentajeCambio}%
                            </div>
                            <div className="text-sm text-[#4D3000] font-['Gabarito'] mt-1">Variación</div>
                        </div>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Gráfico de Ventas por Día */}
                    <div className="bg-[#FFF8ED] rounded-lg shadow-md p-3 sm:p-6 border border-[#D3B178]">
                        <h3 className="text-lg sm:text-xl font-['Epilogue'] font-semibold text-[#3A2400] mb-2 sm:mb-4">
                            Evolución de Ventas
                        </h3>
                        <div className="overflow-x-auto sm:overflow-visible">
                            <div className="min-w-[300px]">
                                <ChartComponent
                                    tipo="linea"
                                    datos={datosGraficos.ventasPorDia}
                                    loading={cargando}
                                    config={{
                                        xKey: 'fecha',
                                        yKey: 'ventas',
                                        color: '#815100'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Gráfico de Ventas por Categoría */}
                    <div className="bg-[#FFF8ED] rounded-lg shadow-md p-3 sm:p-6 border border-[#D3B178]">
                        <h3 className="text-lg sm:text-xl font-['Epilogue'] font-semibold text-[#3A2400] mb-2 sm:mb-4">
                            Ventas por Categoría
                        </h3>
                        <div className="overflow-x-auto sm:overflow-visible">
                            <div className="min-w-[300px]">
                                <VentasPorCategoria
                                    datos={datosGraficos.ventasPorCategoria}
                                    loading={cargando}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Productos Más Vendidos */}
                <div className="bg-[#FFF8ED] rounded-lg shadow-md border border-[#D3B178] overflow-hidden">
                    <div className="p-3 sm:p-6 border-b border-[#D3B178]">
                        <h3 className="text-lg sm:text-xl font-['Epilogue'] font-semibold text-[#3A2400]">
                            Productos Más Vendidos
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#FFF1D9]">
                                <tr>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                        Pos
                                    </th>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider hidden sm:table-cell">
                                        Unidades
                                    </th>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                        Ingresos
                                    </th>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider hidden md:table-cell">
                                        Tendencia
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#D3B178]">
                                {estadisticas.productosMasVendidos.map((producto, index) => (
                                    <tr key={index} className="hover:bg-[#FFF8ED] transition-colors">
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-['Gabarito'] font-bold text-white text-xs sm:text-sm ${
                                                index === 0 ? 'bg-yellow-500' :
                                                index === 1 ? 'bg-gray-400' :
                                                index === 2 ? 'bg-orange-500' :
                                                'bg-[#815100]'
                                            }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                            <div className="text-xs sm:text-sm font-['Gabarito'] font-medium text-[#3A2400]">
                                                {producto.nombre}
                                            </div>
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-[#4D3000] font-['Gabarito'] hidden sm:table-cell">
                                            {producto.ventas} unidades
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-['Gabarito'] font-semibold text-[#3A2400]">
                                             ${producto.ingresos.toLocaleString('es-AR')}
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-['Gabarito'] hidden md:table-cell">
                                            <span className="text-green-600 flex items-center gap-1">
                                                <ChartIcon className="w-3 h-3 sm:w-4 sm:h-4" /> +12%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Métricas Adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178] text-center">
                        <div className="mb-2 flex justify-center"><ChartIcon className="w-6 h-6 text-brand-primary" /></div>
                        <div className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                            67%
                        </div>
                        <div className="text-[#4D3000] font-['Gabarito'] text-sm">
                            Tasa de Conversión
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178] text-center">
                        <div className="mb-2 flex justify-center"><BagIcon className="w-6 h-6 text-brand-primary" /></div>
                        <div className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                            2.3
                        </div>
                        <div className="text-[#4D3000] font-['Gabarito'] text-sm">
                            Productos por Pedido
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178] text-center">
                        <div className="mb-2 flex justify-center"><ChartIcon className="w-6 h-6 text-brand-primary" /></div>
                        <div className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                            23%
                        </div>
                        <div className="text-[#4D3000] font-['Gabarito'] text-sm">
                            Clientes Recurrentes
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178] text-center">
                        <div className="mb-2 flex justify-center"><ChartIcon className="w-6 h-6 text-brand-primary" /></div>
                        <div className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                            4.2 días
                        </div>
                        <div className="text-[#4D3000] font-['Gabarito'] text-sm">
                            Tiempo Promedio de Pago
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminFinanzas
