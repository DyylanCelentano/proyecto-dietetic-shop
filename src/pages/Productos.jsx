import { useState, useEffect } from 'react';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/productos');
        setProductos(data);
      } catch (err) {
        setError('No se pudieron cargar los productos. Por favor, intentá de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return <p className="text-center text-xl mt-10">Cargando productos...</p>;
  }

  if (error) {
    return <p className="text-center text-xl text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="bg-[#FFF8ED] min-h-screen p-6 font-['Gabarito'] flex flex-col items-center">
      {/* Tomamos la misma estructura que tenías en el Home */}
      <div className="flex flex-col items-center text-center w-full">
        <h3 className="text-[#5E3B00] text-3xl font-bold mt-8">
          Explora Nuestros Productos
        </h3>
      </div>
      <div className="w-full max-w-7xl mt-10 bg-[#FFF1D9] border border-[#5E3B00] rounded-xl shadow-md p-6">
        {productos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Aquí está la magia: Usamos .map() para crear una tarjeta por cada producto.
              El código de la tarjeta es el mismo que tenías, pero con datos dinámicos.
            */}
            {productos.map((producto) => (
              <div
                key={producto._id} // La key es muy importante para que React identifique cada elemento
                className="bg-[#FFFAF2] rounded-xl p-4 flex flex-col shadow-sm border-2 border-[#4D3000] h-full"
              >
                {/* Imagen del producto */}
                <img
                  src={producto.imagen}
                  alt={`Imagen de ${producto.nombre}`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />

                <div className="border-t-2 border-[#4D3000] my-2 -mx-4"></div>

                <div className="mt-2 text-base text-[#4D3000] flex flex-col flex-grow">
                  <p className="mb-2">
                    <span className="font-semibold">Nombre: </span>
                    {producto.nombre}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold">Peso: </span>
                    {producto.peso}
                  </p>
                  <p className="mb-2">
                    <span className="font-semibold text-[#088714]">
                      Precio: ${producto.precio}
                    </span>
                  </p>
                  {/* La descripción ocupa el espacio restante */}
                  <p className="flex-grow">
                    <span className="font-semibold">Descripción: </span>
                    {producto.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xl">No hay productos disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default Productos;