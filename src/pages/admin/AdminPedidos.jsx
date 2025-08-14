import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { ChartIcon, CheckIcon, ClockIcon, PackageIcon, WarningIcon } from '../../components/icons/Icons'
import { useToast } from '../../contexts/ToastContext'
import useAdmin from '../../hooks/useAdmin'
import { useAuth } from '../../hooks/useAuth'

const AdminPedidos = () => {
    const { usuario, estaAutenticado, esAdmin } = useAuth()
    const { loading, error } = useAdmin()
    const { mostrarExito, mostrarError } = useToast()
    
    const [pedidos, setPedidos] = useState([])
    const [cargandoPedidos, setCargandoPedidos] = useState(true)
    const [filtros, setFiltros] = useState({
        estado: 'todos',
        busqueda: '',
        fechaDesde: '',
        fechaHasta: ''
    })
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
    const [mostrarDetalles, setMostrarDetalles] = useState(false)
    const [paginaActual, setPaginaActual] = useState(1)
    const pedidosPorPagina = 10

    // Estados de pedidos
    const estadosPedidos = [
        { value: 'pendiente', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: <ClockIcon className="w-4 h-4" /> },
        { value: 'procesando', label: 'Procesando', color: 'bg-blue-100 text-blue-800', icon: <ChartIcon className="w-4 h-4" /> },
        { value: 'enviado', label: 'Enviado', color: 'bg-purple-100 text-purple-800', icon: <PackageIcon className="w-4 h-4" /> },
        { value: 'entregado', label: 'Entregado', color: 'bg-green-100 text-green-800', icon: <CheckIcon className="w-4 h-4" /> },
        { value: 'cancelado', label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: <WarningIcon className="w-4 h-4" /> }
    ]

    // Cargar pedidos simulados
    const cargarPedidos = async () => {
        try {
            setCargandoPedidos(true)
            
            // Datos simulados - en producción usar API real
            const pedidosSimulados = [
                {
                    _id: '1',
                    numero: 'PED-001',
                    cliente: {
                        nombre: 'Juan Pérez',
                        email: 'juan@email.com',
                        telefono: '+54 9 11 1234-5678'
                    },
                    productos: [
                        { nombre: 'Almendras Premium', cantidad: 2, precio: 1500, subtotal: 3000 },
                        { nombre: 'Nueces de California', cantidad: 1, precio: 2200, subtotal: 2200 }
                    ],
                    total: 5200,
                    estado: 'pendiente',
                    fechaCreacion: '2024-10-15T10:30:00Z',
                    direccionEnvio: {
                        calle: 'Av. Corrientes 1234',
                        ciudad: 'Buenos Aires',
                        codigoPostal: '1043',
                        provincia: 'CABA'
                    },
                    metodoPago: 'Tarjeta de Crédito',
                    notas: 'Entregar en horario laboral'
                },
                {
                    _id: '2',
                    numero: 'PED-002',
                    cliente: {
                        nombre: 'María González',
                        email: 'maria@email.com',
                        telefono: '+54 9 11 8765-4321'
                    },
                    productos: [
                        { nombre: 'Semillas de Chía', cantidad: 3, precio: 800, subtotal: 2400 },
                        { nombre: 'Quinoa Orgánica', cantidad: 2, precio: 1200, subtotal: 2400 },
                        { nombre: 'Avena Integral', cantidad: 1, precio: 600, subtotal: 600 }
                    ],
                    total: 5400,
                    estado: 'procesando',
                    fechaCreacion: '2024-10-14T15:45:00Z',
                    direccionEnvio: {
                        calle: 'San Martín 567',
                        ciudad: 'La Plata',
                        codigoPostal: '1900',
                        provincia: 'Buenos Aires'
                    },
                    metodoPago: 'Transferencia Bancaria',
                    notas: ''
                },
                {
                    _id: '3',
                    numero: 'PED-003',
                    cliente: {
                        nombre: 'Carlos Rodríguez',
                        email: 'carlos@email.com',
                        telefono: '+54 9 11 5555-1234'
                    },
                    productos: [
                        { nombre: 'Mix Frutos Secos', cantidad: 1, precio: 1800, subtotal: 1800 }
                    ],
                    total: 1800,
                    estado: 'enviado',
                    fechaCreacion: '2024-10-13T09:15:00Z',
                    direccionEnvio: {
                        calle: 'Rivadavia 890',
                        ciudad: 'Córdoba',
                        codigoPostal: '5000',
                        provincia: 'Córdoba'
                    },
                    metodoPago: 'MercadoPago',
                    notas: 'Urgente'
                },
                {
                    _id: '4',
                    numero: 'PED-004',
                    cliente: {
                        nombre: 'Ana López',
                        email: 'ana@email.com',
                        telefono: '+54 9 11 9999-8888'
                    },
                    productos: [
                        { nombre: 'Granola Casera', cantidad: 2, precio: 900, subtotal: 1800 },
                        { nombre: 'Miel Orgánica', cantidad: 1, precio: 1500, subtotal: 1500 }
                    ],
                    total: 3300,
                    estado: 'entregado',
                    fechaCreacion: '2024-10-12T14:20:00Z',
                    direccionEnvio: {
                        calle: 'Belgrano 345',
                        ciudad: 'Rosario',
                        codigoPostal: '2000',
                        provincia: 'Santa Fe'
                    },
                    metodoPago: 'Efectivo',
                    notas: ''
                }
            ]

            setPedidos(pedidosSimulados)
        } catch (error) {
            console.error('Error cargando pedidos:', error)
            mostrarError('Error al cargar pedidos')
        } finally {
            setCargandoPedidos(false)
        }
    }

    useEffect(() => {
        if (esAdmin) {
            cargarPedidos()
        }
    }, [esAdmin])

    // Filtrar pedidos
    const pedidosFiltrados = pedidos.filter(pedido => {
        const coincideEstado = filtros.estado === 'todos' || pedido.estado === filtros.estado
        const coincideBusqueda = !filtros.busqueda || 
            pedido.numero.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            pedido.cliente.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            pedido.cliente.email.toLowerCase().includes(filtros.busqueda.toLowerCase())
        
        return coincideEstado && coincideBusqueda
    })

    // Paginación
    const indiceInicio = (paginaActual - 1) * pedidosPorPagina
    const indiceFin = indiceInicio + pedidosPorPagina
    const pedidosEnPagina = pedidosFiltrados.slice(indiceInicio, indiceFin)
    const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina)

    // Cambiar estado de pedido
    const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
        try {
            // En producción: await axios.put(`/api/admin/pedidos/${pedidoId}/estado`, { estado: nuevoEstado })
            
            setPedidos(prev => prev.map(pedido => 
                pedido._id === pedidoId 
                    ? { ...pedido, estado: nuevoEstado }
                    : pedido
            ))
            
            mostrarExito(`Estado del pedido actualizado a ${nuevoEstado}`)
        } catch (error) {
            console.error('Error actualizando estado:', error)
            mostrarError('Error al actualizar estado del pedido')
        }
    }

    // Ver detalles del pedido
    const verDetalles = (pedido) => {
        setPedidoSeleccionado(pedido)
        setMostrarDetalles(true)
    }

    // Obtener configuración del estado
    const obtenerConfigEstado = (estado) => {
        return estadosPedidos.find(e => e.value === estado) || estadosPedidos[0]
    }

    // Formatear fecha
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

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
            <div className="p-6 bg-white">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-['Epilogue'] font-bold text-[#3A2400] mb-2">
                            Gestión de Pedidos
                        </h1>
                        <p className="text-sm text-[#4D3000] font-['Gabarito']">
                            Administra y realiza seguimiento de todos los pedidos
                        </p>
                    </div>
                    
                    {/* Resumen rápido */}
                    <div className="flex flex-wrap gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        {estadosPedidos.map(estado => {
                            const cantidad = pedidos.filter(p => p.estado === estado.value).length
                            return (
                                <div key={estado.value} className="text-center px-2 py-1 bg-white rounded-lg shadow-sm w-[calc(50%-6px)] sm:w-auto">
                                    <div className="text-lg sm:text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                                        {cantidad}
                                    </div>
                                    <div className="text-[10px] sm:text-xs text-[#4D3000] font-['Gabarito']">
                                        {estado.label}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-[#FFF8ED] rounded-lg shadow-md p-4 sm:p-6 border border-[#D3B178] mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Búsqueda */}
                        <div>
                            <label className="block text-[#3A2400] font-['Gabarito'] font-medium text-sm sm:text-base mb-2">
                                Buscar pedido
                            </label>
                            <input
                                type="text"
                                value={filtros.busqueda}
                                onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                                placeholder="Número, cliente o email..."
                                className="w-full px-3 sm:px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent text-sm"
                            />
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-[#3A2400] font-['Gabarito'] font-medium text-sm sm:text-base mb-2">
                                Estado
                            </label>
                            <select
                                value={filtros.estado}
                                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                                className="w-full px-3 sm:px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent text-sm"
                            >
                                <option value="todos">Todos los estados</option>
                                {estadosPedidos.map(estado => (
                                    <option key={estado.value} value={estado.value}>
                                        {estado.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fecha */}
                        <div>
                            <label className="block text-[#3A2400] font-['Gabarito'] font-medium text-sm sm:text-base mb-2">
                                Fecha
                            </label>
                            <input
                                type="date"
                                value={filtros.fechaDesde}
                                onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
                                className="w-full px-3 sm:px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Tabla de pedidos */}
                <div className="bg-[#FFF8ED] rounded-lg shadow-md border border-[#D3B178] overflow-hidden">
                    {cargandoPedidos ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#815100] mx-auto"></div>
                            <p className="mt-4 text-[#4D3000] font-['Gabarito']">Cargando pedidos...</p>
                        </div>
                    ) : (
                        <>
                            {/* Vista tarjetas móvil */}
                            <div className="md:hidden divide-y divide-[#D3B178]">
                                {pedidosEnPagina.map(pedido => {
                                    const configEstado = obtenerConfigEstado(pedido.estado)
                                    return (
                                        <div key={pedido._id} className="p-4 bg-white hover:bg-[#FFF8ED] transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-['Epilogue'] font-bold text-[#3A2400]">#{pedido.numero}</p>
                                                    <p className="text-xs text-[#4D3000] mt-0.5">{pedido.cliente.nombre}</p>
                                                    <p className="text-xs text-[#4D3000]/70 truncate max-w-[180px]">{pedido.cliente.email}</p>
                                                </div>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${configEstado.color}`}>{configEstado.icon}<span className="ml-1">{configEstado.label}</span></span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2 text-xs font-['Gabarito'] text-[#4D3000]">
                                                <span className="bg-[#FFF8ED] border border-[#D3B178] px-2 py-1 rounded">Productos: {pedido.productos.length}</span>
                                                <span className="bg-[#FFF8ED] border border-[#D3B178] px-2 py-1 rounded font-semibold text-[#3A2400]">Total: ${pedido.total.toLocaleString('es-AR')}</span>
                                                <span className="text-[#4D3000] text-[10px]">{formatearFecha(pedido.fecha)}</span>
                                            </div>
                                            <div className="mt-3 flex justify-between items-center">
                                                <button onClick={() => verDetalles(pedido)} className="text-[#815100] hover:text-[#5E3B00] flex items-center gap-1 text-xs font-medium">
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                                                    Ver detalles
                                                </button>
                                                {pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
                                                    <select
                                                        value={pedido.estado}
                                                        onChange={(e) => cambiarEstadoPedido(pedido._id, e.target.value)}
                                                        className="text-xs px-2 py-1 border border-[#D3B178] rounded font-['Gabarito']"
                                                    >
                                                        {estadosPedidos.filter(e => e.value !== 'cancelado').map(estado => (
                                                            <option key={estado.value} value={estado.value}>{estado.label}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Tabla escritorio */}
                            <div className="overflow-x-hidden hidden md:block">
                                <table className="w-full table-fixed">
                                    <thead className="bg-[#FFF1D9]">
                                        <tr>
                                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Pedido
                                            </th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Cliente
                                            </th>
                                            <th className="hidden lg:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-[#D3B178]">
                                        {pedidosEnPagina.map((pedido) => {
                                            const configEstado = obtenerConfigEstado(pedido.estado)
                                            return (
                                                <tr key={pedido._id} className="hover:bg-[#FFF8ED] transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-['Gabarito'] font-medium text-[#3A2400]">
                                                            {pedido.numero}
                                                        </div>
                                                        <div className="text-sm text-[#4D3000]">
                                                            {pedido.productos.length} producto{pedido.productos.length !== 1 ? 's' : ''}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-['Gabarito'] font-medium text-[#3A2400]">
                                                            {pedido.cliente.nombre}
                                                        </div>
                                                        <div className="text-sm text-[#4D3000]">
                                                            {pedido.cliente.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4D3000] font-['Gabarito']">
                                                        {formatearFecha(pedido.fechaCreacion)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-['Gabarito'] font-semibold text-[#3A2400]">
                                                        ${pedido.total.toLocaleString('es-AR')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-['Gabarito'] ${configEstado.color}`}>
                                                                {configEstado.icon} {configEstado.label}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => verDetalles(pedido)}
                                                                className="text-[#815100] hover:text-[#5E3B00] transition-colors"
                                                                title="Ver detalles"
                                                            >
                                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/>
                                                                    <circle cx="12" cy="12" r="3"/>
                                                                </svg>
                                                            </button>
                                                            {pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
                                                                <select
                                                                    value={pedido.estado}
                                                                    onChange={(e) => cambiarEstadoPedido(pedido._id, e.target.value)}
                                                                    className="text-xs px-2 py-1 border border-[#D3B178] rounded font-['Gabarito']"
                                                                >
                                                                    {estadosPedidos.filter(e => e.value !== 'cancelado').map(estado => (
                                                                        <option key={estado.value} value={estado.value}>
                                                                            {estado.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {totalPaginas > 1 && (
                                <div className="bg-[#FFF1D9] px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="text-xs sm:text-sm text-[#4D3000] font-['Gabarito'] text-center sm:text-left">
                                        Mostrando {indiceInicio + 1} a {Math.min(indiceFin, pedidosFiltrados.length)} de {pedidosFiltrados.length} pedidos
                                    </div>
                                    <div className="flex gap-1 sm:gap-2">
                                        <button
                                            onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                            disabled={paginaActual === 1}
                                            className="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm bg-white border border-[#D3B178] text-[#3A2400] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF8ED] transition-colors"
                                        >
                                            Anterior
                                        </button>
                                        <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-[#3A2400] font-['Gabarito']">
                                            {paginaActual} de {totalPaginas}
                                        </span>
                                        <button
                                            onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                            disabled={paginaActual === totalPaginas}
                                            className="px-2 sm:px-3 py-1 rounded text-xs sm:text-sm bg-white border border-[#D3B178] text-[#3A2400] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF8ED] transition-colors"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Modal de detalles */}
                {mostrarDetalles && pedidoSeleccionado && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                                        Detalles del Pedido {pedidoSeleccionado.numero}
                                    </h2>
                                    <button
                                        onClick={() => setMostrarDetalles(false)}
                                        className="text-[#4D3000] hover:text-[#3A2400] text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Información del cliente */}
                                    <div className="bg-[#FFF8ED] p-4 rounded-lg">
                                        <h3 className="font-['Epilogue'] font-semibold text-[#3A2400] mb-3">
                                            Información del Cliente
                                        </h3>
                                        <div className="space-y-2 text-sm font-['Gabarito']">
                                            <p><strong>Nombre:</strong> {pedidoSeleccionado.cliente.nombre}</p>
                                            <p><strong>Email:</strong> {pedidoSeleccionado.cliente.email}</p>
                                            <p><strong>Teléfono:</strong> {pedidoSeleccionado.cliente.telefono}</p>
                                        </div>
                                    </div>

                                    {/* Dirección de envío */}
                                    <div className="bg-[#FFF8ED] p-4 rounded-lg">
                                        <h3 className="font-['Epilogue'] font-semibold text-[#3A2400] mb-3">
                                            Dirección de Envío
                                        </h3>
                                        <div className="space-y-2 text-sm font-['Gabarito']">
                                            <p>{pedidoSeleccionado.direccionEnvio.calle}</p>
                                            <p>{pedidoSeleccionado.direccionEnvio.ciudad}, {pedidoSeleccionado.direccionEnvio.provincia}</p>
                                            <p>CP: {pedidoSeleccionado.direccionEnvio.codigoPostal}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Productos */}
                                <div className="mt-6">
                                    <h3 className="font-['Epilogue'] font-semibold text-[#3A2400] mb-3">
                                        Productos del Pedido
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border border-[#D3B178] rounded-lg">
                                            <thead className="bg-[#FFF1D9]">
                                                <tr>
                                                    <th className="px-4 py-2 text-left font-['Gabarito'] text-[#3A2400]">Producto</th>
                                                    <th className="px-4 py-2 text-center font-['Gabarito'] text-[#3A2400]">Cantidad</th>
                                                    <th className="px-4 py-2 text-right font-['Gabarito'] text-[#3A2400]">Precio Unit.</th>
                                                    <th className="px-4 py-2 text-right font-['Gabarito'] text-[#3A2400]">Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pedidoSeleccionado.productos.map((producto, index) => (
                                                    <tr key={index} className="border-t border-[#D3B178]">
                                                        <td className="px-4 py-2 font-['Gabarito']">{producto.nombre}</td>
                                                        <td className="px-4 py-2 text-center font-['Gabarito']">{producto.cantidad}</td>
                                                        <td className="px-4 py-2 text-right font-['Gabarito']">${producto.precio.toLocaleString()}</td>
                                                        <td className="px-4 py-2 text-right font-['Gabarito'] font-semibold">${producto.subtotal.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                                <tr className="border-t-2 border-[#815100] bg-[#FFF1D9]">
                                                    <td colSpan="3" className="px-4 py-2 text-right font-['Gabarito'] font-semibold">Total:</td>
                                                    <td className="px-4 py-2 text-right font-['Gabarito'] font-bold text-lg text-[#3A2400]">
                                                        ${pedidoSeleccionado.total.toLocaleString()}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Información adicional */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-[#FFF8ED] p-4 rounded-lg">
                                        <h3 className="font-['Epilogue'] font-semibold text-[#3A2400] mb-2">
                                            Método de Pago
                                        </h3>
                                        <p className="text-sm font-['Gabarito']">{pedidoSeleccionado.metodoPago}</p>
                                    </div>
                                    
                                    {pedidoSeleccionado.notas && (
                                        <div className="bg-[#FFF8ED] p-4 rounded-lg">
                                            <h3 className="font-['Epilogue'] font-semibold text-[#3A2400] mb-2">
                                                Notas del Pedido
                                            </h3>
                                            <p className="text-sm font-['Gabarito']">{pedidoSeleccionado.notas}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminPedidos
