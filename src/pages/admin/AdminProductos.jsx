import axios from 'axios'
import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { PackageIcon, PencilIcon, TrashIcon } from '../../components/icons/Icons'
import ProductoForm from '../../components/ProductoForm'
import { API_URL } from '../../config/config'
import { useToast } from '../../contexts/ToastContext'
import useAdmin from '../../hooks/useAdmin'
import { useAuth } from '../../hooks/useAuth'
import { getProductImageUrl } from '../../utils/imageHelper'

const AdminProductos = () => {
    const { usuario, estaAutenticado, esAdmin } = useAuth()
    const { loading, error } = useAdmin()
    const { mostrarExito, mostrarError } = useToast()
    
    const [productos, setProductos] = useState([])
    const [cargandoProductos, setCargandoProductos] = useState(true)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [productoEditando, setProductoEditando] = useState(null)
    const [filtros, setFiltros] = useState({
        categoria: '',
        busqueda: '',
        estado: 'todos'
    })
    const [paginaActual, setPaginaActual] = useState(1)
    const productosPorPagina = 10

    // Cargar productos
    const cargarProductos = async () => {
        try {
            setCargandoProductos(true)
            const response = await axios.get(`${API_URL}/productos`)
            console.log('Productos cargados:', response.data)
            setProductos(Array.isArray(response.data) ? response.data : [])
        } catch (error) {
            console.error('Error cargando productos:', error)
            mostrarError('Error al cargar productos')
        } finally {
            setCargandoProductos(false)
        }
    }

    useEffect(() => {
        if (esAdmin) {
            cargarProductos()
        }
    }, [esAdmin])

    // Filtrar productos
    const productosFiltrados = productos.filter(producto => {
        const coincideBusqueda = producto.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
                                producto.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase())
        const coincideCategoria = !filtros.categoria || producto.categoria === filtros.categoria
        const coincideEstado = filtros.estado === 'todos' || 
                               (filtros.estado === 'disponible' && producto.stock?.cantidad > 0) ||
                               (filtros.estado === 'agotado' && (!producto.stock || producto.stock.cantidad === 0)) ||
                               (filtros.estado === 'stock-bajo' && producto.stock?.cantidad > 0 && producto.stock?.cantidad <= 10)
        
        return coincideBusqueda && coincideCategoria && coincideEstado
    })

    // Paginación
    const indiceInicio = (paginaActual - 1) * productosPorPagina
    const indiceFin = indiceInicio + productosPorPagina
    const productosEnPagina = productosFiltrados.slice(indiceInicio, indiceFin)
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina)

    // Manejar edición
    const manejarEditar = (producto) => {
        setProductoEditando(producto)
        setMostrarFormulario(true)
    }

    // Manejar eliminación
    const manejarEliminar = async (producto) => {
        if (window.confirm(`¿Estás seguro de eliminar "${producto.nombre}"?`)) {
            try {
                await axios.delete(`${API_URL}/productos/${producto._id}`)
                mostrarExito('Producto eliminado exitosamente')
                cargarProductos()
            } catch (error) {
                console.error('Error eliminando producto:', error)
                mostrarError('Error al eliminar producto')
            }
        }
    }

    // Manejar guardado de producto
    const manejarGuardarProducto = () => {
        setMostrarFormulario(false)
        setProductoEditando(null)
        cargarProductos()
        mostrarExito(productoEditando ? 'Producto actualizado' : 'Producto creado exitosamente')
    }

    // Categorías disponibles
    const categorias = [
        'Frutos Secos', 'Semillas', 'Harinas y Repostería', 
        'Legumbres', 'Cereales', 'Suplementos', 
        'Bebidas', 'Snacks Saludables', 'Aceites y Aderezos', 'Otros'
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
            <div className="p-6 bg-white">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-['Epilogue'] font-bold text-[#3A2400] mb-2">
                            Gestión de Productos
                        </h1>
                        <p className="text-[#4D3000] font-['Gabarito']">
                            Administra tu catálogo de productos
                        </p>
                    </div>
                    <button
                        onClick={() => setMostrarFormulario(true)}
                        className="w-full md:w-auto bg-[#815100] text-white px-4 sm:px-6 py-3 rounded-lg font-['Gabarito'] hover:bg-[#5E3B00] transition-colors flex items-center justify-center md:justify-start gap-2"
                    >
                        <PackageIcon className="w-5 h-5 text-white" />
                        Agregar Producto
                    </button>
                </div>

                {/* Filtros */}
                <div className="bg-[#FFF8ED] rounded-lg shadow-md p-4 sm:p-6 border border-[#D3B178] mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Búsqueda */}
                        <div>
                            <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                                Buscar producto
                            </label>
                            <input
                                type="text"
                                value={filtros.busqueda}
                                onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                                placeholder="Nombre o descripción..."
                                className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                            />
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                                Categoría
                            </label>
                            <select
                                value={filtros.categoria}
                                onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
                                className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                            >
                                <option value="">Todas las categorías</option>
                                {categorias.map(categoria => (
                                    <option key={categoria} value={categoria}>{categoria}</option>
                                ))}
                            </select>
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                                Estado
                            </label>
                            <select
                                value={filtros.estado}
                                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                                className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                            >
                                <option value="todos">Todos</option>
                                <option value="disponible">Disponible</option>
                                <option value="agotado">Agotado</option>
                                <option value="stock-bajo">Stock Bajo</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de productos */}
                <div className="bg-[#FFF8ED] rounded-lg shadow-md border border-[#D3B178] overflow-hidden">
                    {cargandoProductos ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#815100] mx-auto"></div>
                            <p className="mt-4 text-[#4D3000] font-['Gabarito']">Cargando productos...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#FFF1D9]">
                                        <tr>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Producto
                                            </th>
                                            <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Categoría
                                            </th>
                                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Precio
                                            </th>
                                            <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-[#D3B178]">
                                        {productosEnPagina.map((producto) => (
                                            <tr key={producto._id} className="hover:bg-[#FFF8ED] transition-colors">
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-normal sm:whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                                                            <img
                                                                className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg object-cover"
                                                                src={producto.imagen ? getProductImageUrl(producto.imagen) : '/imgs/icons/placeholder.svg'}
                                                                alt={producto.nombre}
                                                                onError={(e) => {
                                                                    e.target.src = '/imgs/icons/placeholder.svg';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="ml-2 sm:ml-4">
                                                            <div className="text-xs sm:text-sm font-['Gabarito'] font-medium text-[#3A2400] line-clamp-2">
                                                                {producto.nombre}
                                                            </div>
                                                            <div className="hidden sm:block text-xs sm:text-sm text-[#4D3000] truncate max-w-[150px] md:max-w-xs">
                                                                {producto.descripcion}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm text-[#4D3000] font-['Gabarito']">
                                                    {producto.categoria}
                                                </td>
                                                 <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-['Gabarito'] font-semibold text-[#3A2400]">
                                                     ${producto.tipoVenta === 'peso_variable' ? 
                                                        (producto.precioGramo * 100)?.toLocaleString('es-AR') + '/100g' : 
                                                        producto.precioUnidad?.toLocaleString('es-AR')}
                                                </td>
                                                <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-['Gabarito']">
                                                    <span className={`${
                                                        (!producto.stock || producto.stock.cantidad === 0) ? 'text-red-600' :
                                                        producto.stock.cantidad <= 10 ? 'text-yellow-600' :
                                                        'text-green-600'
                                                    } font-semibold`}>
                                                        {producto.stock?.cantidad || 0} {producto.stock?.unidad || 'unidades'}
                                                    </span>
                                                </td>
                                                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-['Gabarito'] ${
                                                        !producto.activo 
                                                            ? 'bg-gray-100 text-gray-800'
                                                            : (!producto.stock || producto.stock.cantidad === 0)
                                                            ? 'bg-red-100 text-red-800'
                                                            : producto.stock.cantidad <= 10
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {!producto.activo ? 'Inactivo' :
                                                         (!producto.stock || producto.stock.cantidad === 0) ? 'Agotado' : 
                                                         producto.stock.cantidad <= 10 ? 'Stock Bajo' : 'Disponible'}
                                                    </span>
                                                </td>
                                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                                                    <div className="flex justify-end gap-1 sm:gap-2">
                                                        <button
                                                            onClick={() => manejarEditar(producto)}
                                                            className="text-[#815100] hover:text-[#5E3B00] transition-colors p-1"
                                                            title="Editar"
                                                        >
                                                            <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => manejarEliminar(producto)}
                                                            className="text-red-600 hover:text-red-800 transition-colors p-1"
                                                            title="Eliminar"
                                                        >
                                                            <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {totalPaginas > 1 && (
                                <div className="bg-[#FFF1D9] px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="text-xs sm:text-sm text-[#4D3000] font-['Gabarito'] text-center sm:text-left">
                                        Mostrando {indiceInicio + 1} a {Math.min(indiceFin, productosFiltrados.length)} de {productosFiltrados.length} productos
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

                {/* Modal de formulario */}
                {mostrarFormulario && (
                    <ProductoForm
                        productoInicial={productoEditando}
                        onGuardar={manejarGuardarProducto}
                        onCerrar={() => {
                            setMostrarFormulario(false)
                            setProductoEditando(null)
                        }}
                    />
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminProductos
