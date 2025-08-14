import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaArrowLeft, FaBoxOpen, FaLeaf, FaShoppingCart, FaTags, FaWeight } from 'react-icons/fa'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { API_URL } from '../config/config'
import { useCart } from '../hooks/useCart'
import { getProductImageUrl } from '../utils/imageHelper'

const DetalleProducto = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useCart()
  
  const [producto, setProducto] = useState(location.state?.producto || null)
  const [loading, setLoading] = useState(!producto)
  const [error, setError] = useState(null)
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState({ cantidad: 100, unidad: 'g' })
  const [imagenActiva, setImagenActiva] = useState(0)

  // Cargar producto si no viene del state
  useEffect(() => {
    if (!producto) {
      const fetchProducto = async () => {
        try {
          setLoading(true)
          setError(null)
          console.log(`Intentando cargar producto con ID/slug: ${id}`)
          const { data } = await axios.get(`${API_URL}/productos/${id}`)
          if (data) {
            setProducto(data)
          } else {
            setError('No se encontró el producto')
          }
        } catch (err) {
          console.error('Error al cargar producto:', err)
          setError(err.response?.data?.message || 'No se pudo cargar el producto')
        } finally {
          setLoading(false)
        }
      }
      fetchProducto()
    }
  }, [id, producto])

  // Configurar cantidad inicial según el tipo de producto
  useEffect(() => {
    if (producto) {
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
    }
  }, [producto])

  const obtenerPrecioProducto = (producto, cantidad = 1, unidad = 'g') => {
    if (producto.tipoVenta === 'unidad') {
      return producto.precioUnidad * cantidad
    } else if (producto.tipoVenta === 'peso_variable') {
      const cantidadEnGramos = unidad === 'kg' ? cantidad * 1000 : cantidad
      return producto.precioGramo * cantidadEnGramos
    } else if (producto.tipoVenta === 'peso_fijo') {
      return producto.precioUnidad * cantidad
    }
    return 0
  }

  const obtenerDescripcionVenta = (producto) => {
    if (producto.tipoVenta === 'unidad') {
      return 'Venta por unidad'
    } else if (producto.tipoVenta === 'peso_variable') {
      return `Venta a granel (${producto.ventaGranel?.pesoMinimo}g - ${producto.ventaGranel?.pesoMaximo}g)`
    } else if (producto.tipoVenta === 'peso_fijo') {
      return `Paquete de ${producto.pesoEnvase?.cantidad}${producto.pesoEnvase?.unidad}`
    }
    return ''
  }

  const handleAgregarCarrito = () => {
    const itemCarrito = {
      ...producto,
      cantidadSeleccionada: cantidadSeleccionada.cantidad,
      unidadSeleccionada: cantidadSeleccionada.unidad,
      precioCalculado: obtenerPrecioProducto(producto, cantidadSeleccionada.cantidad, cantidadSeleccionada.unidad)
    }

    addToCart(itemCarrito)
    
    Swal.fire({
      icon: 'success',
      title: '¡Agregado al carrito!',
      text: `${producto.nombre} x ${cantidadSeleccionada.cantidad}${cantidadSeleccionada.unidad}`,
      timer: 2000,
      showConfirmButton: false
    })
  }

  if (loading) {
    return (
      <div className="bg-[#FFF8ED] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#815100] mx-auto mb-4"></div>
          <p className="text-[#4D3000]">Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="bg-[#FFF8ED] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Producto no encontrado'}</p>
          <button
            onClick={() => navigate('/productos')}
            className="px-6 py-3 bg-[#815100] text-white rounded-lg hover:bg-[#5E3B00] transition-colors"
          >
            Volver a productos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-full mx-auto px-4 md:px-8 lg:px-12">
        {/* Botón volver */}
        <button
          onClick={() => navigate('/productos')}
          className="flex items-center gap-2 mb-6 text-[#815100] hover:text-[#5E3B00] transition-colors"
        >
          <FaArrowLeft />
          Volver a productos
        </button>

        {/* Layout principal */}
        <div className="flex flex-col gap-6">
          {/* Sección superior - Imagen y detalles básicos */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Columna de imagen */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#D3B178] aspect-square">
                <img
                  src={producto.imagen ? getProductImageUrl(producto.imagen) : '/imgs/icons/placeholder.svg'}
                  alt={producto.nombre}
                  className="w-full h-full object-contain bg-white p-2"
                  onError={(e) => {
                    // Evitar múltiples intentos de recarga estableciendo una bandera
                    if (!e.target.hasAttribute('data-error-handled')) {
                      e.target.setAttribute('data-error-handled', 'true')
                      console.log('Error cargando imagen:', producto.nombre)
                      e.target.src = '/imgs/icons/placeholder.svg'
                    }
                  }}
                />
              </div>
              
              {/* Badge de stock */}
              {producto.stock?.cantidad <= producto.stock?.stockMinimo && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg mt-4">
                  <strong>¡Stock limitado!</strong> Solo quedan {producto.stock?.cantidad} {producto.stock?.unidadStock}
                </div>
              )}
            </div>

            {/* Columna de información */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              {/* Título y categoría */}
              <div className="bg-white rounded-xl p-6 border border-[#D3B178] shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#FFF1D9] text-[#815100] px-3 py-1 rounded-lg text-sm font-medium">
                    {producto.categoria}
                  </span>
                  {producto.stock?.cantidad <= producto.stock?.stockMinimo && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
                      Stock bajo
                    </span>
                  )}
                </div>
                <h1 className="font-['Epilogue'] font-bold text-[#5E3B00] text-3xl lg:text-4xl mb-4">
                  {producto.nombre}
                </h1>
                <p className="text-[#4D3000] text-lg leading-relaxed">
                  {producto.descripcion}
                </p>
              </div>

              {/* Tags */}
              {producto.tags && producto.tags.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-[#D3B178] shadow-sm">
                  <h3 className="font-semibold text-[#5E3B00] mb-2 flex items-center gap-2">
                    <FaTags />
                    Características
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {producto.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#088714] bg-opacity-10 text-[#088714] px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1"
                      >
                        <FaLeaf className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sección intermedia - Información nutricional, detalles y selección de cantidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Detalles del producto */}
            <div className="bg-[#FFF8ED] rounded-xl p-6 border border-[#D3B178] shadow-sm space-y-4">
              <h3 className="font-semibold text-[#5E3B00] mb-4 flex items-center gap-2">
                <FaBoxOpen />
                Detalles del producto
              </h3>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <span className="text-[#4D3000] font-medium block">Tipo de venta:</span>
                  <span className="text-[#815100] font-semibold">{obtenerDescripcionVenta(producto)}</span>
                </div>
                
                <div>
                  <span className="text-[#4D3000] font-medium block">Stock disponible:</span>
                  <span className="text-[#815100] font-semibold">
                    {producto.stock?.cantidad} {producto.stock?.unidadStock}
                  </span>
                </div>

                {producto.tipoVenta === 'peso_variable' && (
                  <div>
                    <span className="text-[#4D3000] font-medium block">Precio por kg:</span>
                    <span className="text-[#088714] font-bold">
                      ${((producto.precioGramo || 0) * 1000).toLocaleString('es-AR')}
                    </span>
                  </div>
                )}

                {producto.pesoEnvase?.cantidad && (
                  <div>
                    <span className="text-[#4D3000] font-medium block">Peso del envase:</span>
                    <span className="text-[#815100] font-semibold">
                      {producto.pesoEnvase.cantidad}{producto.pesoEnvase.unidad}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Información nutricional */}
            {producto.informacionNutricional && Object.keys(producto.informacionNutricional).some(key => producto.informacionNutricional[key]) && (
              <div className="bg-[#FFF8ED] rounded-xl p-6 border border-[#D3B178] shadow-sm">
                <h3 className="font-semibold text-[#5E3B00] mb-4">Información Nutricional (por 100g)</h3>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  {producto.informacionNutricional.calorias && (
                    <div>
                      <span className="text-[#4D3000] font-medium">Calorías:</span>
                      <span className="ml-2 font-semibold">{producto.informacionNutricional.calorias} kcal</span>
                    </div>
                  )}
                  {producto.informacionNutricional.proteinas && (
                    <div>
                      <span className="text-[#4D3000] font-medium">Proteínas:</span>
                      <span className="ml-2 font-semibold">{producto.informacionNutricional.proteinas}g</span>
                    </div>
                  )}
                  {producto.informacionNutricional.carbohidratos && (
                    <div>
                      <span className="text-[#4D3000] font-medium">Carbohidratos:</span>
                      <span className="ml-2 font-semibold">{producto.informacionNutricional.carbohidratos}g</span>
                    </div>
                  )}
                  {producto.informacionNutricional.grasas && (
                    <div>
                      <span className="text-[#4D3000] font-medium">Grasas:</span>
                      <span className="ml-2 font-semibold">{producto.informacionNutricional.grasas}g</span>
                    </div>
                  )}
                  {producto.informacionNutricional.fibra && (
                    <div>
                      <span className="text-[#4D3000] font-medium">Fibra:</span>
                      <span className="ml-2 font-semibold">{producto.informacionNutricional.fibra}g</span>
                    </div>
                  )}
                  {producto.informacionNutricional.sodio && (
                    <div>
                      <span className="text-[#4D3000] font-medium">Sodio:</span>
                      <span className="ml-2 font-semibold">{producto.informacionNutricional.sodio}mg</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Selector de cantidad con precio total y botón */}
          <div className="mt-6">
            <div className="bg-[#FFF8ED] rounded-xl p-6 border border-[#D3B178] shadow-sm">
              <h3 className="font-semibold text-[#5E3B00] mb-4 flex items-center gap-2">
                <FaWeight />
                Seleccionar cantidad
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {producto.tipoVenta === 'peso_variable' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[#4D3000] font-medium mb-2">
                          Cantidad en gramos:
                        </label>
                        <input
                          type="range"
                          min={producto.ventaGranel?.pesoMinimo || 100}
                          max={producto.ventaGranel?.pesoMaximo || 2000}
                          step={producto.ventaGranel?.incremento || 50}
                          value={cantidadSeleccionada.cantidad}
                          onChange={(e) => setCantidadSeleccionada({
                            cantidad: parseInt(e.target.value),
                            unidad: 'g'
                          })}
                          className="w-full accent-[#815100]"
                        />
                        <div className="flex justify-between text-sm text-[#815100] mt-1">
                          <span>{producto.ventaGranel?.pesoMinimo}g</span>
                          <span className="font-bold text-lg">{cantidadSeleccionada.cantidad}g</span>
                          <span>{producto.ventaGranel?.pesoMaximo}g</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[#4D3000] font-medium mb-2">
                          Cantidad:
                        </label>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setCantidadSeleccionada(prev => ({
                              ...prev,
                              cantidad: Math.max(1, prev.cantidad - 1)
                            }))}
                            className="w-12 h-12 bg-[#D3B178] text-[#5E3B00] rounded-lg hover:bg-[#815100] hover:text-white transition-colors text-xl font-bold"
                          >
                            -
                          </button>
                          <span className="text-2xl font-bold text-[#4D3000] min-w-[4rem] text-center">
                            {cantidadSeleccionada.cantidad}
                          </span>
                          <button
                            onClick={() => setCantidadSeleccionada(prev => ({
                              ...prev,
                              cantidad: prev.cantidad + 1
                            }))}
                            className="w-12 h-12 bg-[#D3B178] text-[#5E3B00] rounded-lg hover:bg-[#815100] hover:text-white transition-colors text-xl font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-4">
                  {/* Precio total */}
                  <div className="p-4 bg-[#FFF1D9] rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-[#4D3000] font-medium text-lg">Precio total:</span>
                      <span className="text-[#088714] font-['Epilogue'] font-bold text-2xl">
                        ${obtenerPrecioProducto(producto, cantidadSeleccionada.cantidad, cantidadSeleccionada.unidad).toLocaleString('es-AR')}
                      </span>
                    </div>
                  </div>

                  {/* Botón agregar al carrito */}
                  <button
                    onClick={handleAgregarCarrito}
                    disabled={!producto.stock?.disponible || producto.stock?.cantidad === 0}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#088714] text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                  >
                    <FaShoppingCart />
                    {producto.stock?.disponible && producto.stock?.cantidad > 0 
                      ? 'Agregar al carrito' 
                      : 'Sin stock disponible'
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleProducto
