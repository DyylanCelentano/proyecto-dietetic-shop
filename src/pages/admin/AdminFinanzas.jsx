import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ChartComponent from '../../components/admin/ChartComponent';
import StatsCard from '../../components/admin/StatsCard';
import VentasPorCategoria from '../../components/admin/VentasPorCategoria';
import useAdmin from '../../hooks/useAdmin';
import { useAuth } from '../../hooks/useAuth';

const AdminFinanzas = () => {
    const { usuario, estaAutenticado, esAdmin } = useAuth();
    const { loading, error } = useAdmin();
    
    const [estadisticas, setEstadisticas] = useState({
        ventasHoy: 0,
        ventasSemana: 0,
        ventasMes: 0,
        ventasAno: 0,
        ticketPromedio: 0,
        clientesActivos: 0,
        productosMasVendidos: [],
        categoriasMasVendidas: []
    });
    
    const [periodo, setPeriodo] = useState('mes');
    const [datosGraficos, setDatosGraficos] = useState({
        ventasPorDia: [],
        ventasPorCategoria: [],
        productosMasVendidos: []
    });
    
    const [comparacion, setComparacion] = useState({
        periodoActual: 0,
        periodoAnterior: 0,
        porcentajeCambio: 0
    });

    const [cargando, setCargando] = useState(true);

    // Cargar datos financieros
    const cargarDatosFinancieros = async () => {
        try {
            setCargando(true);
            
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
            };

            setEstadisticas(datosSimulados);

            // Datos para gráficos
            const graficos = {
                ventasPorDia: [
                    { fecha: '1 Oct', ventas: 12500 },
                    { fecha: '2 Oct', ventas: 15800 },
                    { fecha: '3 Oct', ventas: 11200 },
                    { fecha: '4 Oct', ventas: 18900 },
                    { fecha: '5 Oct', ventas: 16700 },
                    { fecha: '6 Oct', ventas: 14300 },
                    { fecha: '7 Oct', ventas: 19800 },
                    { fecha: '8 Oct', ventas: 22100 },
                    { fecha: '9 Oct', ventas: 17600 },
                    { fecha: '10 Oct', ventas: 20400 }
                ],
                ventasPorCategoria: datosSimulados.categoriasMasVendidas,
                productosMasVendidos: datosSimulados.productosMasVendidos
            };

            setDatosGraficos(graficos);

            // Comparación con período anterior
            setComparacion({
                periodoActual: datosSimulados.ventasMes,
                periodoAnterior: 298750,
                porcentajeCambio: 14.7
            });

        } catch (error) {
            console.error('Error cargando datos financieros:', error);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (esAdmin) {
            cargarDatosFinancieros();
        }
    }, [esAdmin, periodo]);

    // Filtros de fecha
    const periodos = [
        { value: 'hoy', label: 'Hoy' },
        { value: 'semana', label: 'Esta Semana' },
        { value: 'mes', label: 'Este Mes' },
        { value: 'ano', label: 'Este Año' },
        { value: 'personalizado', label: 'Personalizado' }
    ];

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
        );
    }

    return (
        <AdminLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-['Epilogue'] font-bold text-[#3A2400] mb-2">
                            Finanzas y Analytics
                        </h1>
                        <p className="text-[#4D3000] font-['Gabarito']">
                            Análisis detallado de ventas y rendimiento
                        </p>
                    </div>
                    
                    {/* Selector de período */}
                    <div className="flex items-center gap-4">
                        <label className="text-[#3A2400] font-['Gabarito'] font-medium">
                            Período:
                        </label>
                        <select
                            value={periodo}
                            onChange={(e) => setPeriodo(e.target.value)}
                            className="px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent font-['Gabarito']"
                        >
                            {periodos.map(p => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* KPIs Principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        titulo="Ventas Hoy"
                        valor={`$${estadisticas.ventasHoy.toLocaleString()}`}
                        icono="💰"
                        color="bg-green-100 border-green-300"
                        loading={cargando}
                        subtitulo="Ingresos del día"
                    />
                    <StatsCard
                        titulo="Ventas del Mes"
                        valor={`$${estadisticas.ventasMes.toLocaleString()}`}
                        icono="📊"
                        color="bg-blue-100 border-blue-300"
                        loading={cargando}
                        subtitulo={`+${comparacion.porcentajeCambio}% vs mes anterior`}
                    />
                    <StatsCard
                        titulo="Ticket Promedio"
                        valor={`$${estadisticas.ticketPromedio.toLocaleString()}`}
                        icono="💳"
                        color="bg-purple-100 border-purple-300"
                        loading={cargando}
                        subtitulo="Valor promedio por compra"
                    />
                    <StatsCard
                        titulo="Clientes Activos"
                        valor={estadisticas.clientesActivos}
                        icono="👥"
                        color="bg-orange-100 border-orange-300"
                        loading={cargando}
                        subtitulo="Compraron este mes"
                    />
                </div>

                {/* Comparación de Períodos */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178]">
                    <h3 className="text-xl font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                        Comparación de Rendimiento
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                                ${comparacion.periodoActual.toLocaleString()}
                            </div>
                            <div className="text-[#4D3000] font-['Gabarito'] mt-1">Período Actual</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-['Epilogue'] font-bold text-[#4D3000]">
                                ${comparacion.periodoAnterior.toLocaleString()}
                            </div>
                            <div className="text-[#4D3000] font-['Gabarito'] mt-1">Período Anterior</div>
                        </div>
                        <div className="text-center">
                            <div className={`text-2xl font-['Epilogue'] font-bold ${comparacion.porcentajeCambio >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {comparacion.porcentajeCambio >= 0 ? '+' : ''}{comparacion.porcentajeCambio}%
                            </div>
                            <div className="text-[#4D3000] font-['Gabarito'] mt-1">Variación</div>
                        </div>
                    </div>
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico de Ventas por Día */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178]">
                        <h3 className="text-xl font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                            Evolución de Ventas
                        </h3>
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

                    {/* Gráfico de Ventas por Categoría */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178]">
                        <h3 className="text-xl font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                            Ventas por Categoría
                        </h3>
                        <VentasPorCategoria
                            datos={datosGraficos.ventasPorCategoria}
                            loading={cargando}
                        />
                    </div>
                </div>

                {/* Productos Más Vendidos */}
                <div className="bg-white rounded-lg shadow-md border border-[#D3B178] overflow-hidden">
                    <div className="p-6 border-b border-[#D3B178]">
                        <h3 className="text-xl font-['Epilogue'] font-semibold text-[#3A2400]">
                            Productos Más Vendidos
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#FFF1D9]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                        Posición
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                        Unidades Vendidas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                        Ingresos Generados
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                        Tendencia
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#D3B178]">
                                {estadisticas.productosMasVendidos.map((producto, index) => (
                                    <tr key={index} className="hover:bg-[#FFF8ED] transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-['Gabarito'] font-bold text-white ${
                                                index === 0 ? 'bg-yellow-500' :
                                                index === 1 ? 'bg-gray-400' :
                                                index === 2 ? 'bg-orange-500' :
                                                'bg-[#815100]'
                                            }`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-['Gabarito'] font-medium text-[#3A2400]">
                                                {producto.nombre}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4D3000] font-['Gabarito']">
                                            {producto.ventas} unidades
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-['Gabarito'] font-semibold text-[#3A2400]">
                                            ${producto.ingresos.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-['Gabarito']">
                                            <span className="text-green-600 flex items-center">
                                                📈 +12%
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
                        <div className="text-3xl mb-2">🎯</div>
                        <div className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                            67%
                        </div>
                        <div className="text-[#4D3000] font-['Gabarito'] text-sm">
                            Tasa de Conversión
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178] text-center">
                        <div className="text-3xl mb-2">🛒</div>
                        <div className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                            2.3
                        </div>
                        <div className="text-[#4D3000] font-['Gabarito'] text-sm">
                            Productos por Pedido
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178] text-center">
                        <div className="text-3xl mb-2">🔄</div>
                        <div className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                            23%
                        </div>
                        <div className="text-[#4D3000] font-['Gabarito'] text-sm">
                            Clientes Recurrentes
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178] text-center">
                        <div className="text-3xl mb-2">💳</div>
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
    );
};

export default AdminFinanzas;
