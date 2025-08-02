import { useEffect } from 'react';
import axios from 'axios';
import useFormularioAuth from '../hooks/useFormularioAuth';
import { validarProducto, validarNombre, validarPrecio, validarPeso } from '../utils/validaciones';

const VALORES_INICIALES = {
  nombre: '',
  descripcion: '',
  precio: '',
  peso: '',
  imagen: '',
  categoria: '',
  tags: ''
};

const ProductoForm = ({ productoInicial, onGuardar, onCerrar }) => {
  const {
    datosFormulario,
    setDatosFormulario,
    errores,
    cargando,
    manejarCambio,
    validarCampo,
    validarFormulario,
    establecerCargando,
    establecerErrores,
  } = useFormularioAuth(VALORES_INICIALES, validarProducto);

  // Bloquear scroll al montar, liberar al desmontar
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (productoInicial) {
      setDatosFormulario({
        ...productoInicial,
        tags: productoInicial.tags.join(', ')
      });
    }
  }, [productoInicial, setDatosFormulario]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valido formulario antes
    if(!validarFormulario()) {
      return;
    }

    establecerCargando(true);
    establecerErrores({});

    const datosAEnviar = {
      ...datosFormulario,
      precio: Number(datosFormulario.precio),
      peso: Number(datosFormulario.peso),
      tags: datosFormulario.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean),
    };

    try {
      if (productoInicial) {
        await axios.put(
          `http://localhost:5000/api/productos/${productoInicial._id}`,
          datosAEnviar
        );
      } else {
        await axios.post('http://localhost:5000/api/productos', datosAEnviar);
      }
      onGuardar();
    } catch (error) {
      console.error('Error al guardar el producto', error);
      // Manejar errores de validación del backend
      if (error.response && error.response.status === 400 && error.response.data.errores) {
        establecerErrores(error.response.data.errores);
      } else {
        establecerErrores({ form: 'No se pudo guardar el producto. Inténtalo de nuevo.' });
      }
    } finally {
      establecerCargando(false);
    }
  };

  const claseInput = `
    w-full pl-4 pr-4 py-3
    bg-[#FFF8ED] border border-[#D3B178] rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-[#815100] focus:bg-white focus:border-[#815100]
    hover:bg-white hover:border-[#b39869]
    text-[#3A2400] placeholder-[#5E3B00]/60 font-['Gabarito']
    text-sm md:text-base
  `;

  return (
    <div className="fixed inset-0 bg-[#FFF8ED]/80 flex justify-center items-center z-50">
      <div className="bg-[#FFF1D9] p-8 rounded-xl shadow-xl border-2 border-[#4D3000] w-full max-w-2xl font-['Gabarito']">
        <h2 className="text-2xl font-bold mb-6 text-[#5E3B00] text-center">
          {productoInicial ? 'Editar Producto' : 'Crear Producto'}
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Nombre<span className='text-red-500'>*</span></label>
              <input
                name="nombre"
                value={datosFormulario.nombre}
                onChange={manejarCambio}
                onBlur={() => validarCampo('nombre')}
                placeholder="Nombre del producto"
                className={`${claseInput} ${errores.nombre ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errores.nombre && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errores.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Precio<span className='text-red-500'>*</span></label>
              <input
                type="number"
                name="precio"
                value={datosFormulario.precio}
                onBlur={() => validarCampo('precio')}
                onChange={manejarCambio}
                placeholder="Precio"
                min="0.01"
                step="0.01"
                className={`${claseInput} ${errores.precio ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errores.precio && (
                <p className='text-red-500 text-sm mt-1 animate-fadeIn'>{errores.precio}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Peso (gramos)<span className='text-red-500'>*</span></label>
              <div className="relative">
                <input
                  type="number"
                  name="peso"
                  value={datosFormulario.peso}
                  onChange={manejarCambio}
                  onBlur={() => validarCampo('peso')}
                  placeholder="250"
                  min="1"
                  max="99999"
                  className={`${claseInput} pr-8 ${errores.peso ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5E3B00] font-medium">
                  g
                </span>
              </div>
              {errores.peso && (
                <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errores.peso}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Categoría</label>
              <input
                name="categoria"
                value={datosFormulario.categoria}
                onChange={manejarCambio}
                placeholder="Categoría"
                className={claseInput}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Imagen (URL)</label>
              <input
                name="imagen"
                value={datosFormulario.imagen}
                onChange={manejarCambio}
                placeholder="URL de la imagen"
                className={claseInput}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Descripción<span className='text-red-500'>*</span></label>
              <textarea
                name="descripcion"
                value={datosFormulario.descripcion}
                onChange={manejarCambio}
                onBlur={() => validarCampo('descripcion')}
                placeholder="Descripción del producto"
                rows={3}
                maxLength={200}
                className={`${claseInput} resize-none ${errores.descripcion ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              <div className="flex justify-between items-center mt-1">
                {errores.descripcion && (
                  <p className="text-red-500 text-xs animate-fadeIn">{errores.descripcion}</p>
                )}
                <p className="text-xs text-[#5E3B00]/60 ml-auto">
                  {datosFormulario.descripcion.length}/200
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Tags</label>
              <input
                name="tags"
                value={datosFormulario.tags}
                onChange={manejarCambio}
                placeholder="Tags (separados por comas)"
                className={claseInput}
              />
            </div>
          </div>

          {errores.form && (
            <p className="text-red-500 text-sm mt-2 animate-fadeIn">{errores.form}</p>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors disabled:bg-green-300 cursor-pointer"
            >
              {cargando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoForm;
