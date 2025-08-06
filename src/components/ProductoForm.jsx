import axios from 'axios';
import { useEffect, useState } from 'react';
import useFormularioAuth from '../hooks/useFormularioAuth';
import { validarProducto } from '../utils/validaciones';

const VALORES_INICIALES = {
  nombre: '',
  descripcion: '',
  precio: '',
  peso: '',
  imagen: '',
  categoria: '',
  tags: []
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

  // Nuevo estado para guardar las categorías que vienen del backend
  const [categorias, setCategorias] = useState([]);
  const [tagsDisponibles, setTagsDisponibles] = useState([]); // Estado tags
  const [archivoImagen, setArchivoImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  // Bloquear scroll al montar, liberar al desmontar
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // useEffect para cargar categorías y tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCategorias, resTags] = await Promise.all([
          axios.get('http://localhost:5000/api/productos/categorias'),
          axios.get('http://localhost:5000/api/productos/tags')
        ]);
        setCategorias(resCategorias.data);
        setTagsDisponibles(resTags.data);
      } catch (error) {
        console.error("Error al obtener datos para el formulario", error);
      }
    };
    fetchData();
  }, []);

  // useEffect para rellenar el formulario al editar
  useEffect(() => {
    if (productoInicial) {
      setDatosFormulario({ ...productoInicial, tags: productoInicial.tags || [] });
      // Si estamos editando, mostramos la imagen que ya tiene el producto
      setPreviewImagen(productoInicial.imagen); 
    } else {
      setDatosFormulario(VALORES_INICIALES);
      setPreviewImagen('');
    }
  }, [productoInicial, setDatosFormulario]);

  // Handler para cuando el usuario selecciona un archivo
  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoImagen(file);
      // Creamos una URL local para la previsualización instantánea
      setPreviewImagen(URL.createObjectURL(file));
    }
  };

  const handleTagClick = (tag) => {
    const nuevosTags = datosFormulario.tags.includes(tag)
      ? datosFormulario.tags.filter(t => t !== tag) // Si ya está, lo quita
      : [...datosFormulario.tags, tag]; // Si no está, lo añade
    
    setDatosFormulario(prev => ({ ...prev, tags: nuevosTags }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    establecerCargando(true);
    let imageUrl = datosFormulario.imagen; // Usa la imagen existente por defecto

    // 1. Si el usuario seleccionó un nuevo archivo, lo subimos primero
    if (archivoImagen) {
      setSubiendo(true);
      const formData = new FormData();
      formData.append('imagen', archivoImagen);

      try {
        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadResponse.data.imageUrl; // Obtén la URL de la imagen subida
        setSubiendo(false);
      } catch (uploadError) {
        console.error('Error al subir la imagen:', uploadError);
        establecerErrores({ form: 'Error al subir la imagen. Inténtalo de nuevo.' });
        establecerCargando(false);
        setSubiendo(false);
        return;
      }
    }

    // 2. Después subir/editar el producto con la URL de la imagen
    try {
      const datosProducto = { ...datosFormulario, imagen: imageUrl };
      await onGuardar(datosProducto);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      establecerErrores({ form: 'Error al guardar el producto. Inténtalo de nuevo.' });
    } finally {
      establecerCargando(false);
    }
  };

  // Estilos para inputs
  const claseInput = `
    w-full px-4 py-3 border border-[#D3B178] rounded-lg bg-[#FFF8ED]/50 
    focus:outline-none focus:ring-2 focus:ring-[#815100] focus:bg-white focus:border-[#815100]
    hover:bg-white hover:border-[#b39869]
    text-[#3A2400] placeholder-[#5E3B00]/60 font-['Gabarito']
    text-sm md:text-base
  `;

  return (
    <div className="fixed inset-0 bg-[#FFF8ED]/80 flex justify-center items-center z-50 p-4">
      <div className="bg-[#FFF1D9] p-6 rounded-xl shadow-xl border-2 border-[#4D3000] w-full max-w-5xl max-h-[90vh] overflow-y-auto font-['Gabarito']">
        <div className="sticky top-0 bg-[#FFF1D9] pb-4 mb-6 border-b border-[#D3B178]">
          <h2 className="text-2xl font-bold text-[#5E3B00] text-center">
            {productoInicial ? 'Editar Producto' : 'Crear Producto'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda - Información Básica */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#4D3000] mb-2 font-semibold">
                    Nombre<span className='text-red-500'>*</span>
                  </label>
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
                  <label className="block text-sm text-[#4D3000] mb-2 font-semibold">
                    Precio<span className='text-red-500'>*</span>
                  </label>
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
                  <label className="block text-sm text-[#4D3000] mb-2 font-semibold">
                    Peso (gramos)<span className='text-red-500'>*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="peso"
                      value={datosFormulario.peso}
                      onBlur={() => validarCampo('peso')}
                      onChange={manejarCambio}
                      placeholder="Peso en gramos"
                      min="1"
                      className={`${claseInput} ${errores.peso ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#4D3000]/70 text-sm">
                      g
                    </span>
                  </div>
                  {errores.peso && (
                    <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errores.peso}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-[#4D3000] mb-2 font-semibold">
                    Categoría<span className='text-red-500'>*</span>
                  </label>
                  <select
                    name="categoria"
                    value={datosFormulario.categoria}
                    onChange={manejarCambio}
                    onBlur={() => validarCampo('categoria')}
                    className={`${claseInput} ${errores.categoria ? 'border-red-500 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categorias.map(categoria => (
                      <option key={categoria._id} value={categoria.nombre}>{categoria.nombre}</option>
                    ))}
                  </select>
                  {errores.categoria && (
                    <p className="text-red-500 text-xs mt-1 animate-fadeIn">{errores.categoria}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#4D3000] mb-2 font-semibold">Descripción</label>
                <textarea
                  name="descripcion"
                  value={datosFormulario.descripcion}
                  onChange={manejarCambio}
                  placeholder="Descripción del producto..."
                  rows="4"
                  className={`${claseInput} resize-none`}
                />
              </div>

              <div>
                <label className="block text-sm text-[#4D3000] mb-2 font-semibold">Tags</label>
                <div className="flex flex-wrap gap-2 p-3 bg-[#FFF8ED] border border-[#D3B178] rounded-lg min-h-[60px]">
                  {tagsDisponibles.length > 0 ? (
                    tagsDisponibles.map(tag => {
                      const isSelected = datosFormulario.tags.includes(tag);
                      return (
                        <button
                          type="button"
                          key={tag}
                          onClick={() => handleTagClick(tag)}
                          className={`
                            px-3 py-1 rounded-full text-sm font-medium transition-all
                            ${isSelected 
                              ? 'bg-[#815100] text-white shadow-sm' 
                              : 'bg-white text-[#5E3B00] border border-[#D3B178] hover:bg-[#f0e6d5]'
                            }
                          `}
                        >
                          {tag}
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-[#4D3000]/60 text-sm">No hay tags disponibles</p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna Derecha - Imagen */}
            <div className="lg:col-span-1">
              <label className="block text-sm text-[#4D3000] mb-2 font-semibold">Imagen del producto</label>
              <div className="space-y-4">
                <div className="w-full h-64 border-2 border-dashed border-[#D3B178] rounded-lg bg-[#FFF8ED] flex items-center justify-center overflow-hidden">
                  {previewImagen ? (
                    <img 
                      src={previewImagen} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-[#4D3000]/60">
                      <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-sm">Selecciona una imagen</p>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  onChange={handleArchivoChange}
                  accept="image/*"
                  className="w-full text-sm text-[#4D3000] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#815100] file:text-white hover:file:bg-[#5E3B00] file:cursor-pointer"
                />
                
                {previewImagen && (
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImagen('');
                      setArchivoImagen(null);
                    }}
                    className="w-full py-2 px-4 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Quitar imagen
                  </button>
                )}
              </div>
            </div>
          </div>

          {errores.form && (
            <p className="text-red-500 text-sm mt-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
              {errores.form}
            </p>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-[#D3B178]">
            <button
              type="button"
              onClick={onCerrar}
              className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300 cursor-pointer"
            >
              {cargando ? (subiendo ? 'Subiendo imagen...' : 'Guardando...') : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoForm;
