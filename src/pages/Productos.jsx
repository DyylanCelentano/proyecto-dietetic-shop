import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { FaEye, FaFilter, FaSearch, FaShoppingCart, FaTimes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import ProductoForm from '../components/ProductoForm'
import ToastContainer from '../components/ui/ToastContainer'
import { API_URL } from '../config/config'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/format'
import { getProductImageUrl } from '../utils/imageHelper'

const Productos = () => {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estados para los filtros mejorados
  const [categorias, setCategorias] = useState([])
  const [tags, setTags] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroActivo, setFiltroActivo] = useState({ 
    categoria: null, 
    tags: [],
    busqueda: '',
    ordenPor: 'nombre' // nombre, precio_asc, precio_desc, stock
  })
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  // Estados para el modal de cantidad al agregar al carrito
  const [modalCantidad, setModalCantidad] = useState(null)
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState({ cantidad: 100, unidad: 'g' })

  // Estado para el modal y el producto que se está editando
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoAEditar, setProductoAEditar] = useState(null)

  // Usar el contexto para saber si el usuario es admin
  const { esAdmin, cargando: cargandoAuth } = useAuth()
  const { addToCart } = useCart()
  const { toasts, mostrarExito, mostrarError, cerrarToast } = useToast()

  // Función para cargar productos sin filtros del servidor (para optimizar)
  const fetchProductos = useCallback(async () => {
    setLoading(true)
    try {
      const url = `${API_URL}/productos`
      const { data } = await axios.get(url)
      setProductos(data)
      setProductosFiltrados(data)
    } catch (err) {
      setError('No se pudieron cargar los productos.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Función para filtrar productos en el frontend
  const aplicarFiltros = useCallback(() => {
    let productosFiltrados = [...productos]

    // Filtrar por categoría
    if (filtroActivo.categoria && filtroActivo.categoria !== 'Mostrar Todos') {
      productosFiltrados = productosFiltrados.filter(p => p.categoria === filtroActivo.categoria)
    }

    // Filtrar por tags
    if (filtroActivo.tags.length > 0) {
      productosFiltrados = productosFiltrados.filter(p => 
        filtroActivo.tags.some(tag => p.tags && p.tags.includes(tag))
      )
    }

    // Filtrar por búsqueda
    if (filtroActivo.busqueda.trim()) {
      const termino = filtroActivo.busqueda.toLowerCase().trim()
      productosFiltrados = productosFiltrados.filter(p => 
        p.nombre.toLowerCase().includes(termino) ||
        p.descripcion.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(termino)))
      )
    }

    // Ordenar productos
    switch (filtroActivo.ordenPor) {
      case 'precio_asc':
        productosFiltrados.sort((a, b) => {
          const precioA = a.precioUnidad || (a.precioGramo * 100) || 0
          const precioB = b.precioUnidad || (b.precioGramo * 100) || 0
          return precioA - precioB
        })
        break
      case 'precio_desc':
        productosFiltrados.sort((a, b) => {
          const precioA = a.precioUnidad || (a.precioGramo * 100) || 0
          const precioB = b.precioUnidad || (b.precioGramo * 100) || 0
          return precioB - precioA
        })
        break
      case 'stock':
        productosFiltrados.sort((a, b) => (b.stock?.cantidad || 0) - (a.stock?.cantidad || 0))
        break
      default:
        productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre))
    }

    // Solo mostrar productos activos y disponibles
    productosFiltrados = productosFiltrados.filter(p => p.activo && p.stock?.disponible)

    setProductosFiltrados(productosFiltrados)
  }, [productos, filtroActivo])

  // Función para obtener el precio de un producto
  const obtenerPrecioProducto = (producto) => {
    if (producto.tipoVenta === 'unidad') {
      return formatCurrency(producto.precioUnidad)
    } else if (producto.tipoVenta === 'peso_variable') {
      return `${formatCurrency((producto.precioGramo || 0) * 1000)} / kg`
    } else if (producto.tipoVenta === 'peso_fijo') {
      return formatCurrency(producto.precioUnidad)
    }
    return 'Precio no disponible'
  }

  // Función para obtener la descripción de la unidad de venta
  const obtenerDescripcionVenta = (producto) => {
    if (producto.tipoVenta === 'unidad') {
      return 'Por unidad'
    } else if (producto.tipoVenta === 'peso_variable') {
      return `Granel (${producto.ventaGranel?.pesoMinimo}g - ${producto.ventaGranel?.pesoMaximo}g)`
    } else if (producto.tipoVenta === 'peso_fijo') {
      return `Paquete de ${producto.pesoEnvase?.cantidad}${producto.pesoEnvase?.unidad}`
    }
    return ''
  }


  // useEffect para cargar los productos inicialmente
  useEffect(() => {
    fetchProductos()
  }, [fetchProductos])

  // useEffect para aplicar filtros cuando cambien
  useEffect(() => {
    aplicarFiltros()
  }, [aplicarFiltros])

  // useEffect para manejar la tecla Escape en el modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && modalCantidad) {
        setModalCantidad(null)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [modalCantidad])

  // useEffect para cargar las categorías y tags una sola vez
  useEffect(() => {
    const fetchFiltros = async () => {
      try {
        const [resCategorias, resTags] = await Promise.all([
          axios.get(`${API_URL}/productos/categorias`),
          axios.get(`${API_URL}/productos/tags`),
        ])
        setCategorias(resCategorias.data)
        setTags(resTags.data)
      } catch (err) {
        console.error("Error al cargar opciones de filtro", err)
      }
    }
    fetchFiltros()
  }, [])

  // Handlers para filtros
  const handleBusqueda = (e) => {
    const valor = e.target.value
    setBusqueda(valor)
    setFiltroActivo(prev => ({ ...prev, busqueda: valor }))
  }

  const handleCategoriaClick = (categoria) => {
    setFiltroActivo(prev => ({
      ...prev,
      categoria: prev.categoria === categoria || categoria === 'Mostrar Todos' ? null : categoria,
    }))
  }

  const handleTagClick = (tag) => {
    setFiltroActivo(prev => {
      const nuevosTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
      return { ...prev, tags: nuevosTags }
    })
  }

  const handleOrdenChange = (orden) => {
    setFiltroActivo(prev => ({ ...prev, ordenPor: orden }))
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setFiltroActivo({
      categoria: null,
      tags: [],
      busqueda: '',
      ordenPor: 'nombre'
    })
  }

  // Handler para ver detalle del producto
  const verDetalleProducto = (producto) => {
    navigate(`/producto/${producto.slug || producto._id}`, { state: { producto } })
  }

  // Handler para agregar al carrito con modal de cantidad
  const abrirModalCantidad = (producto) => {
    console.log('Abriendo modal para producto:', producto) // Debug
    
    try {
      if (producto.tipoVenta === 'peso_variable') {
        setCantidadSeleccionada({ 
          cantidad: producto.ventaGranel?.pesoMinimo || 100, 
          unidad: 'g' 
        })
      } else if (producto.tipoVenta === 'peso_fijo') {
        setCantidadSeleccionada({ cantidad: 1, unidad: 'unidades' })
      } else {
        setCantidadSeleccionada({ cantidad: 1, unidad: 'unidades' })
      }
      setModalCantidad(producto)
    } catch (error) {
      console.error('Error al abrir modal de cantidad:', error)
      mostrarError('Error al abrir el selector de cantidad')
    }
  }

  const confirmarAgregarCarrito = () => {
    if (!modalCantidad) return
    
    try {
      // Verificar si hay suficiente stock disponible
      const stockDisponible = modalCantidad.stock?.cantidad || 0;
      let cantidadRequerida = cantidadSeleccionada.cantidad;
      
      // Para productos de peso variable, convertir gramos a la unidad de stock (normalmente kg)
      if (modalCantidad.tipoVenta === 'peso_variable' && 
          cantidadSeleccionada.unidad === 'g' && 
          modalCantidad.stock?.unidadStock === 'kg') {
        cantidadRequerida = cantidadSeleccionada.cantidad / 1000;
      }
      
      // Verificar si hay stock suficiente
      if (cantidadRequerida > stockDisponible) {
        mostrarError(`No hay suficiente stock disponible. Stock actual: ${stockDisponible} ${modalCantidad.stock?.unidadStock || 'unidades'}`);
        return;
      }
      
      // Calcular precio de manera más robusta
      let precioCalculado = 0
      
      if (modalCantidad.tipoVenta === 'peso_variable') {
        precioCalculado = (modalCantidad.precioGramo || 0) * cantidadSeleccionada.cantidad
      } else {
        precioCalculado = (modalCantidad.precioUnidad || 0) * cantidadSeleccionada.cantidad
      }
      
      const itemCarrito = {
        ...modalCantidad,
        cantidadSeleccionada: cantidadSeleccionada.cantidad,
        unidadSeleccionada: cantidadSeleccionada.unidad,
        precioCalculado: precioCalculado
      }

      console.log('Agregando al carrito:', itemCarrito) // Debug
      console.log('Precio calculado:', precioCalculado) // Debug adicional
      
      addToCart(itemCarrito)
      
      // Cerrar modal inmediatamente
      setModalCantidad(null)
      setCantidadSeleccionada({ cantidad: 100, unidad: 'g' })
      
      // Mostrar toast no invasivo
      mostrarExito(
        `${modalCantidad.nombre} agregado al carrito (${cantidadSeleccionada.cantidad}${cantidadSeleccionada.unidad})`
      )
    } catch (error) {
      console.error('Error al agregar al carrito:', error)
      mostrarError('Error al agregar el producto al carrito')
      setModalCantidad(null)
    }
  }

  // --- HANDLERS PARA ACCIONES CRUD ---

  const abrirModalParaCrear = () => {
    setProductoAEditar(null) // Asegurarse de que no hay producto seleccionado
    setModalAbierto(true)
  }

  const abrirModalParaEditar = (producto) => {
    setProductoAEditar(producto)
    setModalAbierto(true)
  }

  const handleEliminar = async (productoId) => {
    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    })

    if (resultado.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/productos/${productoId}`)
        setProductos(productos.filter(p => p._id !== productoId))
        mostrarExito('Producto eliminado correctamente')
      } catch (err) {
        console.error('Error al eliminar producto:', err)
        setError('No se pudo eliminar el producto.')
        mostrarError('No se pudo eliminar el producto')
      }
    }
  }
  
  const handleGuardarProducto = () => {
    setModalAbierto(false)
    fetchProductos() 
  }

  if (loading || cargandoAuth) {
    return <p className="text-center text-xl mt-10">Cargando...</p>
  }

  return (
    <>
      <div className="bg-white min-h-screen p-6 font-['Gabarito']">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-[#5E3B00] text-4xl font-['Epilogue'] font-bold mb-4">
              Nuestros Productos Naturales
            </h1>
            <p className="text-[#4D3000] text-lg max-w-2xl mx-auto">
              Descubre nuestra selección de productos dietéticos de alta calidad
            </p>
            {esAdmin && (
              <button
                onClick={abrirModalParaCrear}
                className="mt-4 px-6 py-3 bg-[#088714] text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
              >
                + Crear Nuevo Producto
              </button>
            )}
          </div>

          {/* Barra de búsqueda y controles */}
          <div className="bg-[#FFF8ED] rounded-xl shadow-lg border border-[#D3B178] p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
              {/* Búsqueda */}
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#815100]" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={handleBusqueda}
                  className="w-full pl-10 pr-4 py-3 border border-[#D3B178] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#815100] focus:border-[#815100]"
                />
              </div>

              {/* Ordenamiento */}
              <div className="flex items-center gap-2">
                <label className="text-[#4D3000] font-medium">Ordenar por:</label>
                <select
                  value={filtroActivo.ordenPor}
                  onChange={(e) => handleOrdenChange(e.target.value)}
                  className="px-3 py-2 border border-[#D3B178] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#815100] bg-white"
                >
                  <option value="nombre">Nombre A-Z</option>
                  <option value="precio_asc">Precio ↑</option>
                  <option value="precio_desc">Precio ↓</option>
                  <option value="stock">Stock disponible</option>
                </select>
              </div>

              {/* Toggle filtros */}
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="flex items-center gap-2 px-4 py-2 bg-[#815100] text-white rounded-lg hover:bg-[#5E3B00] transition-colors"
              >
                <FaFilter />
                Filtros
              </button>
            </div>

            {/* Filtros expandibles */}
            {mostrarFiltros && (
              <div className="border-t border-[#D3B178] pt-4">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Categorías */}
                  <div>
                    <h4 className="font-semibold text-[#5E3B00] mb-3">Categorías</h4>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => handleCategoriaClick('Mostrar Todos')} 
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                          !filtroActivo.categoria 
                            ? 'bg-[#815100] text-white border-[#815100] shadow-sm' 
                            : 'bg-white text-[#5E3B00] border-[#D3B178] hover:bg-[#FFF1D9] hover:border-[#815100]'
                        }`}
                      >
                        Mostrar Todos
                      </button>
                      {categorias.map(cat => (
                        <button 
                          key={cat} 
                          onClick={() => handleCategoriaClick(cat)} 
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                            filtroActivo.categoria === cat 
                              ? 'bg-[#815100] text-white border-[#815100] shadow-sm' 
                              : 'bg-white text-[#5E3B00] border-[#D3B178] hover:bg-[#FFF1D9] hover:border-[#815100]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="font-semibold text-[#5E3B00] mb-3">Características</h4>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {tags.map(tag => (
                        <button 
                          key={tag} 
                          onClick={() => handleTagClick(tag)} 
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all border ${
                            filtroActivo.tags.includes(tag) 
                              ? 'bg-[#815100] text-white border-[#815100] shadow-sm' 
                              : 'bg-white text-[#5E3B00] border-[#D3B178] hover:bg-[#FFF1D9] hover:border-[#815100]'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Botón limpiar filtros */}
                {(filtroActivo.categoria || filtroActivo.tags.length > 0 || filtroActivo.busqueda) && (
                  <div className="mt-4 pt-4 border-t border-[#D3B178]">
                    <button
                      onClick={limpiarFiltros}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <FaTimes />
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contador de resultados */}
          <div className="mb-6">
            <p className="text-[#4D3000] font-medium">
              Mostrando {productosFiltrados.length} de {productos.length} productos
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Grid de productos */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#815100]"></div>
              <p className="text-[#4D3000] mt-4">Cargando productos...</p>
            </div>
          ) : productosFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((producto) => (
                <div 
                  key={producto._id} 
                  className="bg-[#FFF8ED] rounded-xl shadow-lg border border-[#D3B178] overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Imagen del producto */}
                  <div className="relative group">
                    <img 
                      src={producto.imagen ? getProductImageUrl(producto.imagen) : '/imgs/icons/placeholder.svg'} 
                      alt={producto.nombre} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 bg-white" 
                      onError={(e) => {
                        // Evitar múltiples intentos de recarga estableciendo una bandera
                        if (!e.target.hasAttribute('data-error-handled')) {
                          e.target.setAttribute('data-error-handled', 'true')
                          console.log('Error cargando imagen:', producto.nombre)
                          e.target.src = '/imgs/icons/placeholder.svg'
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => verDetalleProducto(producto)}
                        className="opacity-0 group-hover:opacity-100 bg-white text-[#815100] px-3 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 hover:bg-[#FFF1D9]"
                      >
                        <FaEye />
                        Ver detalle
                      </button>
                    </div>
                    
                    {/* Badge de stock bajo - Solo visible para admin */}
                    {esAdmin && producto.stock?.cantidad <= producto.stock?.stockMinimo && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                        Stock bajo
                      </div>
                    )}
                  </div>

                  {/* Contenido del producto */}
                  <div className="p-4">
                    {/* Título y categoría */}
                    <div className="mb-3">
                      <h3 className="font-['Epilogue'] font-bold text-[#5E3B00] text-lg mb-1 line-clamp-2">
                        {producto.nombre}
                      </h3>
                      <span className="inline-block bg-[#FFF1D9] text-[#815100] px-2 py-1 rounded-lg text-xs font-medium">
                        {producto.categoria}
                      </span>
                    </div>

                    {/* Tags */}
                    {producto.tags && producto.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {producto.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index}
                            className="bg-[#088714] bg-opacity-10 text-[#088714] px-2 py-1 rounded text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {producto.tags.length > 3 && (
                          <span className="text-[#815100] text-xs font-medium">
                            +{producto.tags.length - 3} más
                          </span>
                        )}
                      </div>
                    )}

                    {/* Descripción */}
                    <p className="text-[#4D3000] text-sm mb-3 line-clamp-2">
                      {producto.descripcion}
                    </p>

                    {/* Tipo de venta */}
                    <div className="mb-3 text-sm">
                      <p className="text-[#815100] font-medium">
                        {obtenerDescripcionVenta(producto)}
                      </p>
                      {/* Solo mostrar stock para administradores */}
                      {esAdmin && (
                        <p className="text-[#4D3000]">
                          Stock: {producto.stock?.cantidad} {producto.stock?.unidadStock}
                        </p>
                      )}
                    </div>

                    {/* Precio */}
                    <div className="mb-4">
                      <p className="text-[#088714] font-['Epilogue'] font-bold text-xl">
                        {obtenerPrecioProducto(producto)}
                      </p>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => abrirModalCantidad(producto)}
                        disabled={!producto.stock?.disponible || producto.stock?.cantidad === 0}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#088714] text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                      >
                        <FaShoppingCart />
                        {producto.stock?.disponible && producto.stock?.cantidad > 0 ? 'Agregar' : 'Sin stock'}
                      </button>
                      
                      {esAdmin && (
                        <div className="flex gap-1">
                          <button 
                            onClick={() => abrirModalParaEditar(producto)} 
                            className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleEliminar(producto._id)} 
                            className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#FFF8ED] rounded-xl shadow-lg border border-[#D3B178]">
              <p className="text-[#4D3000] text-lg">
                No se encontraron productos con los filtros seleccionados.
              </p>
              <button
                onClick={limpiarFiltros}
                className="mt-4 px-6 py-2 bg-[#815100] text-white rounded-lg hover:bg-[#5E3B00] transition-colors"
              >
                Mostrar todos los productos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal para seleccionar cantidad */}
      {modalCantidad && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            // Cerrar modal al hacer clic fuera
            if (e.target === e.currentTarget) {
              setModalCantidad(null)
            }
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-['Epilogue'] font-bold text-[#5E3B00] text-xl">
                Seleccionar cantidad
              </h3>
              <button
                onClick={() => setModalCantidad(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-[#4D3000] mb-2">{modalCantidad.nombre}</h4>
              <p className="text-[#815100] font-bold text-lg">
                {obtenerPrecioProducto(modalCantidad)}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-[#4D3000] font-medium mb-2">
                {modalCantidad.tipoVenta === 'peso_variable' ? 'Cantidad en gramos:' : 'Cantidad:'}
              </label>
              
              {modalCantidad.tipoVenta === 'peso_variable' ? (
                <div>
                  <input
                    type="range"
                    min={modalCantidad.ventaGranel?.pesoMinimo || 100}
                    max={modalCantidad.ventaGranel?.pesoMaximo || 2000}
                    step={modalCantidad.ventaGranel?.incremento || 50}
                    value={cantidadSeleccionada.cantidad}
                    onChange={(e) => setCantidadSeleccionada({
                      cantidad: parseInt(e.target.value),
                      unidad: 'g'
                    })}
                    className="w-full mb-2"
                  />
                  <div className="flex justify-between text-sm text-[#815100]">
                    <span>{modalCantidad.ventaGranel?.pesoMinimo}g</span>
                    <span className="font-bold">{cantidadSeleccionada.cantidad}g</span>
                    <span>{modalCantidad.ventaGranel?.pesoMaximo}g</span>
                  </div>
                  <p className="mt-2 text-[#088714] font-bold">
                    Precio: {formatCurrency((modalCantidad.precioGramo || 0) * cantidadSeleccionada.cantidad)}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCantidadSeleccionada(prev => ({
                        ...prev,
                        cantidad: Math.max(1, prev.cantidad - 1)
                      }))}
                      className="px-3 py-2 bg-[#D3B178] text-[#5E3B00] rounded-lg hover:bg-[#815100] hover:text-white transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold text-[#4D3000] min-w-[3rem] text-center">
                      {cantidadSeleccionada.cantidad}
                    </span>
                    <button
                      onClick={() => setCantidadSeleccionada(prev => ({
                        ...prev,
                        cantidad: prev.cantidad + 1
                      }))}
                      className="px-3 py-2 bg-[#D3B178] text-[#5E3B00] rounded-lg hover:bg-[#815100] hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="mt-2 text-[#088714] font-bold">
                    Precio total: {formatCurrency((modalCantidad.precioUnidad || 0) * cantidadSeleccionada.cantidad)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalCantidad(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAgregarCarrito}
                className="flex-1 px-4 py-2 bg-[#088714] text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para crear/editar producto */}
      {modalAbierto && (
        <ProductoForm 
          productoInicial={productoAEditar}
          onGuardar={handleGuardarProducto}
          onCerrar={() => setModalAbierto(false)}
        />
      )}

      {/* Toast Container para notificaciones no invasivas */}
      <ToastContainer toasts={toasts} onCerrar={cerrarToast} />
    </>
  )
}

export default Productos
