import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProductoForm from '../components/ProductoForm';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import Swal from 'sweetalert2';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para los filtros
  const [categorias, setCategorias] = useState([]);
  const [tags, setTags] = useState([]);
  const [filtroActivo, setFiltroActivo] = useState({ categoria: null, tags: [] });

  // Estado para el modal y el producto que se está editando
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);

  // 2. Usar el contexto para saber si el usuario es admin
  const { esAdmin, cargando: cargandoAuth } = useAuth();
  const { addToCart } = useCart();

  // Usamos useCallback para evitar que la función se recree innecesariamente
  const fetchProductos = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroActivo.categoria && filtroActivo.categoria !== 'Mostrar Todos') {
        params.append('categoria', filtroActivo.categoria);
      }
      if (filtroActivo.tags.length > 0) {
        params.append('tags', filtroActivo.tags.join(','));
      }
      
      const url = `http://localhost:5000/api/productos?${params.toString()}`;
      const { data } = await axios.get(url);
      setProductos(data);
    } catch (err) {
      setError('No se pudieron cargar los productos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filtroActivo]);


  // useEffect para cargar los productos cuando cambia el filtro
  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // useEffect para cargar las categorías y tags una sola vez
  useEffect(() => {
    const fetchFiltros = async () => {
      try {
        const [resCategorias, resTags] = await Promise.all([
          axios.get('http://localhost:5000/api/productos/categorias'),
          axios.get('http://localhost:5000/api/productos/tags'),
        ]);
        setCategorias(resCategorias.data);
        setTags(resTags.data);
      } catch (err) {
        console.error("Error al cargar opciones de filtro", err);
      }
    };
    fetchFiltros();
  }, []);

  const handleCategoriaClick = (categoria) => {
    setFiltroActivo(prev => ({
      ...prev,
      categoria: prev.categoria === categoria || categoria === 'Mostrar Todos' ? null : categoria,
    }));
  };

  // CAMBIO: Lógica para manejar el clic en un tag (añadir/quitar del array)
  const handleTagClick = (tag) => {
    setFiltroActivo(prev => {
      const nuevosTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: nuevosTags };
    });
  };

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

        {/* --- SECCIÓN DE FILTROS --- */}
        <div className="w-full max-w-7xl mt-10 p-4 bg-[#FFF1D9] border border-[#5E3B00] rounded-xl shadow-md">
          <div className="mb-4">
            <h4 className="font-semibold text-[#5E3B00] mb-2">Categorías</h4>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleCategoriaClick('Mostrar Todos')} className={`px-3 py-1 rounded-full text-sm font-medium transition-all border ${!filtroActivo.categoria ? 'bg-[#815100] text-white border-[#815100] shadow-sm' : 'bg-white text-[#5E3B00] border-[#D3B178] hover:bg-[#f0e6d5] hover:border-[#815100]'}`}>Mostrar Todos</button>
              {categorias.map(cat => (
                <button key={cat} onClick={() => handleCategoriaClick(cat)} className={`px-3 py-1 rounded-full text-sm font-medium transition-all border ${filtroActivo.categoria === cat ? 'bg-[#815100] text-white border-[#815100] shadow-sm' : 'bg-white text-[#5E3B00] border-[#D3B178] hover:bg-[#f0e6d5] hover:border-[#815100]'}`}>{cat}</button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#5E3B00] mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button key={tag} onClick={() => handleTagClick(tag)} className={`px-3 py-1 rounded-full text-sm font-medium transition-all border ${filtroActivo.tags.includes(tag) ? 'bg-[#815100] text-white border-[#815100] shadow-sm' : 'bg-white text-[#5E3B00] border-[#D3B178] hover:bg-[#f0e6d5] hover:border-[#815100]'}`}>{tag}</button>
              ))}
            </div>
          </div>
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
            <p className="text-center text-xl bg-[#FFF1D9] border border-[#5E3B00] rounded-xl shadow-md p-10">
              No se encontraron productos con el filtro seleccionado.
            </p>
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
