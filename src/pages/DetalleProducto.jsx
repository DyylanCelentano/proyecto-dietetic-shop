import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaArrowLeft, FaBoxOpen, FaLeaf, FaShoppingCart, FaTags, FaWeight } from 'react-icons/fa';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCart } from '../hooks/useCart';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  
  const [producto, setProducto] = useState(location.state?.producto || null);
  const [loading, setLoading] = useState(!producto);
  const [error, setError] = useState(null);
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState({ cantidad: 100, unidad: 'g' });
  const [imagenActiva, setImagenActiva] = useState(0);

  // Cargar producto si no viene del state
  useEffect(() => {
    if (!producto) {
      const fetchProducto = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`http://localhost:5000/api/productos/${id}`);
          setProducto(data);
        } catch (err) {
          setError('No se pudo cargar el producto');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchProducto();
    }
  }, [id, producto]);

  // Configurar cantidad inicial según el tipo de producto
  useEffect(() => {
    if (producto) {
      if (producto.tipoVenta === 'peso_variable') {
        setCantidadSeleccionada({ 
          cantidad: producto.ventaGranel?.pesoMinimo || 100, 
          unidad: 'g' 
        });
      } else if (producto.tipoVenta === 'peso_fijo') {
        setCantidadSeleccionada({ cantidad: 1, unidad: 'unidades' });
      } else {
        setCantidadSeleccionada({ cantidad: 1, unidad: 'unidades' });
      }
    }
  }, [producto]);

  const obtenerPrecioProducto = (producto, cantidad = 1, unidad = 'g') => {
    if (producto.tipoVenta === 'unidad') {
      return producto.precioUnidad * cantidad;
    } else if (producto.tipoVenta === 'peso_variable') {
      const cantidadEnGramos = unidad === 'kg' ? cantidad * 1000 : cantidad;
      return producto.precioGramo * cantidadEnGramos;
    } else if (producto.tipoVenta === 'peso_fijo') {
      return producto.precioUnidad * cantidad;
    }
    return 0;
  };

  const obtenerDescripcionVenta = (producto) => {
    if (producto.tipoVenta === 'unidad') {
      return 'Venta por unidad';
    } else if (producto.tipoVenta === 'peso_variable') {
      return `Venta a granel (${producto.ventaGranel?.pesoMinimo}g - ${producto.ventaGranel?.pesoMaximo}g)`;
    } else if (producto.tipoVenta === 'peso_fijo') {
      return `Paquete de ${producto.pesoEnvase?.cantidad}${producto.pesoEnvase?.unidad}`;
    }
    return '';
  };

  const handleAgregarCarrito = () => {
    const itemCarrito = {
      ...producto,
      cantidadSeleccionada: cantidadSeleccionada.cantidad,
      unidadSeleccionada: cantidadSeleccionada.unidad,
      precioCalculado: obtenerPrecioProducto(producto, cantidadSeleccionada.cantidad, cantidadSeleccionada.unidad)
    };

    addToCart(itemCarrito);
    
    Swal.fire({
      icon: 'success',
      title: '¡Agregado al carrito!',
      text: `${producto.nombre} x ${cantidadSeleccionada.cantidad}${cantidadSeleccionada.unidad}`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  if (loading) {
    return (
      <div className="bg-[#FFF8ED] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#815100] mx-auto mb-4"></div>
          <p className="text-[#4D3000]">Cargando producto...</p>
        </div>
      </div>
    );
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
    );
  }

  return (
    <div className="bg-[#FFF8ED] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Botón volver */}
        <button
          onClick={() => navigate('/productos')}
          className="flex items-center gap-2 mb-6 text-[#815100] hover:text-[#5E3B00] transition-colors"
        >
          <FaArrowLeft />
          Volver a productos
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#D3B178]">
              <img
                src={producto.imagen || '/api/placeholder/600/400'}
                alt={producto.nombre}
                className="w-full h-96 object-cover"
              />
            </div>
            
            {/* Badge de stock */}
            {producto.stock?.cantidad <= producto.stock?.stockMinimo && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg">
                <strong>¡Stock limitado!</strong> Solo quedan {producto.stock?.cantidad} {producto.stock?.unidadStock}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Título y categoría */}
            <div>
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
              <div>
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

            {/* Información nutricional */}
            {producto.informacionNutricional && Object.keys(producto.informacionNutricional).some(key => producto.informacionNutricional[key]) && (
              <div className="bg-white rounded-xl p-6 border border-[#D3B178]">
                <h3 className="font-semibold text-[#5E3B00] mb-4">Información Nutricional (por 100g)</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
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

            {/* Detalles del producto */}
            <div className="bg-white rounded-xl p-6 border border-[#D3B178] space-y-4">
              <h3 className="font-semibold text-[#5E3B00] mb-4 flex items-center gap-2">
                <FaBoxOpen />
                Detalles del producto
              </h3>
              
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#4D3000] font-medium">Tipo de venta:</span>
                  <span className="text-[#815100] font-semibold">{obtenerDescripcionVenta(producto)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-[#4D3000] font-medium">Stock disponible:</span>
                  <span className="text-[#815100] font-semibold">
                    {producto.stock?.cantidad} {producto.stock?.unidadStock}
                  </span>
                </div>

                {producto.tipoVenta === 'peso_variable' && (
                  <div className="flex justify-between">
                    <span className="text-[#4D3000] font-medium">Precio por kg:</span>
                    <span className="text-[#088714] font-bold">
                      ${(producto.precioGramo * 1000)?.toLocaleString()}
                    </span>
                  </div>
                )}

                {producto.pesoEnvase?.cantidad && (
                  <div className="flex justify-between">
                    <span className="text-[#4D3000] font-medium">Peso del envase:</span>
                    <span className="text-[#815100] font-semibold">
                      {producto.pesoEnvase.cantidad}{producto.pesoEnvase.unidad}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Selector de cantidad y precio */}
            <div className="bg-white rounded-xl p-6 border border-[#D3B178]">
              <h3 className="font-semibold text-[#5E3B00] mb-4 flex items-center gap-2">
                <FaWeight />
                Seleccionar cantidad
              </h3>

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
                      className="w-full"
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

              {/* Precio total */}
              <div className="mt-6 p-4 bg-[#FFF1D9] rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-[#4D3000] font-medium text-lg">Precio total:</span>
                  <span className="text-[#088714] font-['Epilogue'] font-bold text-2xl">
                    ${obtenerPrecioProducto(producto, cantidadSeleccionada.cantidad, cantidadSeleccionada.unidad).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Botón agregar al carrito */}
              <button
                onClick={handleAgregarCarrito}
                disabled={!producto.stock?.disponible || producto.stock?.cantidad === 0}
                className="w-full mt-6 flex items-center justify-center gap-3 px-6 py-4 bg-[#088714] text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-lg"
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
  );
};

export default DetalleProducto;
