import axios from 'axios'
import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { PackageIcon, PencilIcon, TrashIcon } from '../../components/icons/Icons'
import ProductoForm from '../../components/ProductoForm'
import { useToast } from '../../contexts/ToastContext'
import useAdmin from '../../hooks/useAdmin'
import { useAuth } from '../../hooks/useAuth'

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
            const response = await axios.get('/api/productos')
            setProductos(response.data.productos || [])
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
                               (filtros.estado === 'disponible' && producto.stock > 0) ||
                               (filtros.estado === 'agotado' && producto.stock === 0) ||
                               (filtros.estado === 'stock-bajo' && producto.stock > 0 && producto.stock <= 10)
        
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
                await axios.delete(`/api/productos/${producto._id}`)
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
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-['Epilogue'] font-bold text-[#3A2400] mb-2">
                            Gestión de Productos
                        </h1>
                        <p className="text-[#4D3000] font-['Gabarito']">
                            Administra tu catálogo de productos
                        </p>
                    </div>
                    <button
                        onClick={() => setMostrarFormulario(true)}
                        className="bg-[#815100] text-white px-6 py-3 rounded-lg font-['Gabarito'] hover:bg-[#5E3B00] transition-colors flex items-center gap-2"
                    >
                        <PackageIcon className="w-5 h-5 text-white" />
                        Agregar Producto
                    </button>
                </div>

                {/* Filtros */}
                <div className="bg-[#FFF8ED] rounded-lg shadow-md p-6 border border-[#D3B178] mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                            <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Producto
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Categoría
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Precio
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-[#D3B178]">
                                        {productosEnPagina.map((producto) => (
                                            <tr key={producto._id} className="hover:bg-[#FFF8ED] transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-12 w-12 flex-shrink-0">
                                                            <img
                                                                className="h-12 w-12 rounded-lg object-cover"
                                                                src={producto.imagen || '/placeholder-product.jpg'}
                                                                alt={producto.nombre}
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-['Gabarito'] font-medium text-[#3A2400]">
                                                                {producto.nombre}
                                                            </div>
                                                            <div className="text-sm text-[#4D3000] truncate max-w-xs">
                                                                {producto.descripcion}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4D3000] font-['Gabarito']">
                                                    {producto.categoria}
                                                </td>
                                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-['Gabarito'] font-semibold text-[#3A2400]">
                                                     ${producto.precio?.toLocaleString('es-AR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-['Gabarito']">
                                                    <span className={`${
                                                        producto.stock === 0 ? 'text-red-600' :
                                                        producto.stock <= 10 ? 'text-yellow-600' :
                                                        'text-green-600'
                                                    } font-semibold`}>
                                                        {producto.stock} unidades
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-['Gabarito'] ${
                                                        producto.stock === 0 
                                                            ? 'bg-red-100 text-red-800'
                                                            : producto.stock <= 10
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {producto.stock === 0 ? 'Agotado' : 
                                                         producto.stock <= 10 ? 'Stock Bajo' : 'Disponible'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => manejarEditar(producto)}
                                                            className="text-[#815100] hover:text-[#5E3B00] transition-colors"
                                                            title="Editar"
                                                        >
                                                            <PencilIcon className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => manejarEliminar(producto)}
                                                            className="text-red-600 hover:text-red-800 transition-colors ml-2"
                                                            title="Eliminar"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
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
                                <div className="bg-[#FFF1D9] px-6 py-3 flex items-center justify-between">
                                    <div className="text-sm text-[#4D3000] font-['Gabarito']">
                                        Mostrando {indiceInicio + 1} a {Math.min(indiceFin, productosFiltrados.length)} de {productosFiltrados.length} productos
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                            disabled={paginaActual === 1}
                                            className="px-3 py-1 rounded bg-white border border-[#D3B178] text-[#3A2400] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF8ED] transition-colors"
                                        >
                                            Anterior
                                        </button>
                                        <span className="px-3 py-1 text-[#3A2400] font-['Gabarito']">
                                            {paginaActual} de {totalPaginas}
                                        </span>
                                        <button
                                            onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                            disabled={paginaActual === totalPaginas}
                                            className="px-3 py-1 rounded bg-white border border-[#D3B178] text-[#3A2400] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF8ED] transition-colors"
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
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-['Epilogue'] font-bold text-[#3A2400]">
                                        {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setMostrarFormulario(false)
                                            setProductoEditando(null)
                                        }}
                                        className="text-[#4D3000] hover:text-[#3A2400] text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>
                                <ProductoForm
                                    productoInicial={productoEditando}
                                    onSuccess={manejarGuardarProducto}
                                    onCancel={() => {
                                        setMostrarFormulario(false)
                                        setProductoEditando(null)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminProductos
