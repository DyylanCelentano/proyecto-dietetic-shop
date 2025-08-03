import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductoForm from '../components/ProductoForm';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import Swal from 'sweetalert2';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el modal y el producto que se está editando
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);

  // 2. Usar el contexto para saber si el usuario es admin
  const { esAdmin, cargando: cargandoAuth } = useAuth();
  const { addToCart } = useCart();

  const fetchProductos = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/productos');
      setProductos(data);
    } catch (err) {
      setError('No se pudieron cargar los productos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // --- HANDLERS PARA ACCIONES CRUD ---

  const abrirModalParaCrear = () => {
    setProductoAEditar(null); // Asegurarse de que no hay producto seleccionado
    setModalAbierto(true);
  };

  const abrirModalParaEditar = (producto) => {
    setProductoAEditar(producto);
    setModalAbierto(true);
  };

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
    });

    if (resultado.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/productos/${productoId}`);
        setProductos(productos.filter(p => p._id !== productoId));
        Swal.fire('Eliminado', 'El producto fue eliminado exitosamente.', 'success');
      } catch (err) {
        console.error('Error al eliminar producto:', err);
        setError('No se pudo eliminar el producto.');
        Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
      }
    }
  };
  
  const handleGuardarProducto = () => {
    setModalAbierto(false);
    fetchProductos(); 
  };

  if (loading || cargandoAuth) {
    return <p className="text-center text-xl mt-10">Cargando...</p>;
  }

  return (
    <>
      <div className="bg-[#FFF8ED] min-h-screen p-6 font-['Gabarito'] flex flex-col items-center">
        <div className="flex flex-col items-center text-center w-full max-w-7xl">
          <h3 className="text-[#5E3B00] text-3xl font-bold mt-8">
            Explora Nuestros Productos
          </h3>
          {esAdmin && (
            <button
              onClick={abrirModalParaCrear}
              className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              + Crear Nuevo Producto
            </button>
          )}
        </div>
        
        {error && <p className="text-center text-xl text-red-500 mt-10">{error}</p>}

        <div className="w-full max-w-7xl mt-10 bg-[#FFF1D9] border border-[#5E3B00] rounded-xl shadow-md p-6">
          {productos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {productos.map((producto) => (
                <div key={producto._id} className="bg-[#FFFAF2] rounded-xl p-4 flex flex-col shadow-sm border-2 border-[#4D3000] h-full">
                  <img src={producto.imagen} alt={producto.nombre} className="w-full h-48 object-cover rounded-md mb-4" />
                  <div className="border-t-2 border-[#4D3000] my-2 -mx-4"></div>
                  <div className="mt-2 text-base text-[#4D3000] flex flex-col flex-grow">
                    <p><span className="font-semibold">Nombre: </span>{producto.nombre}</p>
                    <p className='text-[#088714]'><span className="font-semibold text-[#088714]">Precio: </span>${producto.precio}</p>
                    <p><span className="font-semibold">Peso: </span>{producto.peso}g</p>
                    <p><span className='font-semibold'>Categoría: </span>{producto.categoria}</p>
                    <p><span className='font-semibold'>Tags: </span>
                      {Array.isArray(producto.tags)
                        ? producto.tags.join(', ')
                        : producto.tags}
                    </p>
                    <p className="flex-grow"><span className="font-semibold">Descripción: </span>{producto.descripcion}</p>
                  </div>

                  <div className="border-t-2 border-[#D6B58D] mt-4 pt-4 flex justify-end gap-3">
                    <button
                      onClick={() => addToCart(producto)}
                      className="px-4 py-1 bg-green-500 text-white text-md font-semibold rounded hover:bg-green-600 cursor-pointer"
                    >
                      Agregar al Carrito
                    </button>
                    {esAdmin && (
                      <>
                        <button onClick={() => abrirModalParaEditar(producto)} className="px-4 py-1 bg-blue-500 text-white text-md font-semibold rounded hover:bg-blue-600 cursor-pointer">
                          Editar
                        </button>
                        <button onClick={() => handleEliminar(producto._id)} className="px-4 py-1 bg-red-600 text-white text-md font-medium rounded hover:bg-red-700 cursor-pointer">
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xl">No hay productos disponibles.</p>
          )}
        </div>
      </div>
      
      {modalAbierto && (
        <ProductoForm 
            productoInicial={productoAEditar}
            onGuardar={handleGuardarProducto}
            onCerrar={() => setModalAbierto(false)}
        />
      )}
    </>
  );
};

export default Productos;
