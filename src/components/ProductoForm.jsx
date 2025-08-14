import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaInfoCircle, FaSave, FaTimes, FaUpload } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { API_URL } from '../config/config'
import { getProductImageUrl } from '../utils/imageHelper'

const ProductoForm = ({ productoInicial, onGuardar, onCerrar }) => {
  const VALORES_INICIALES = {
    nombre: '',
    descripcion: '',
    categoria: '',
    tags: [],
    tipoVenta: 'unidad', // 'unidad', 'peso_variable', 'peso_fijo'
    precioUnidad: '',
    precioGramo: '',
    pesoEnvase: {
      cantidad: '',
      unidad: 'g'
    },
    ventaGranel: {
      disponible: false,
      cantidadMinima: 50,
      incrementos: 50,
      unidad: 'g'
    },
    stock: {
      cantidad: 0,
      minimo: 5,
      unidad: 'unidades'
    },
    informacionNutricional: {
      calorias: '',
      proteinas: '',
      grasas: '',
      carbohidratos: '',
      fibra: '',
      sodio: ''
    },
    imagen: '',
    activo: true
  }

  const [datosFormulario, setDatosFormulario] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [tagsDisponibles, setTagsDisponibles] = useState([])
  const [archivoImagen, setArchivoImagen] = useState(null)
  const [previewImagen, setPreviewImagen] = useState('')

  // useEffect para cargar categorías y tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCategorias, resTags] = await Promise.all([
          axios.get(`${API_URL}/productos/categorias`),
          axios.get(`${API_URL}/productos/tags`)
        ])
        setCategorias(resCategorias.data)
        setTagsDisponibles(resTags.data)
      } catch (error) {
        console.error("Error al obtener datos para el formulario", error)
      }
    }
    fetchData()
  }, [])

  // useEffect para rellenar el formulario al editar
  useEffect(() => {
    if (productoInicial) {
      setDatosFormulario({
        ...VALORES_INICIALES,
        ...productoInicial,
        tags: productoInicial.tags || [],
        pesoEnvase: productoInicial.pesoEnvase || VALORES_INICIALES.pesoEnvase,
        ventaGranel: productoInicial.ventaGranel || VALORES_INICIALES.ventaGranel,
        stock: productoInicial.stock || VALORES_INICIALES.stock,
        informacionNutricional: productoInicial.informacionNutricional || VALORES_INICIALES.informacionNutricional
      })
      setPreviewImagen(productoInicial.imagen ? getProductImageUrl(productoInicial.imagen) : '')
    }
  }, [productoInicial])

  // Manejar cambios en inputs simples
  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target
    setDatosFormulario(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Manejar cambios en objetos anidados
  const manejarCambioAnidado = (path, value) => {
    const keys = path.split('.')
    setDatosFormulario(prev => {
      const updated = { ...prev }
      let current = updated

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return updated
    })
  }

  // Validar formulario
  const validarFormulario = () => {
    const nuevosErrores = {}

    if (!datosFormulario.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio'
    } else if (datosFormulario.nombre.length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres'
    }

    if (!datosFormulario.descripcion.trim()) {
      nuevosErrores.descripcion = 'La descripción es obligatoria'
    } else if (datosFormulario.descripcion.length < 10) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres'
    }

    if (!datosFormulario.categoria) {
      nuevosErrores.categoria = 'La categoría es obligatoria'
    }

    // Validar precios según el tipo de venta
    if (datosFormulario.tipoVenta === 'peso_variable') {
      if (!datosFormulario.precioGramo || datosFormulario.precioGramo <= 0) {
        nuevosErrores.precioGramo = 'El precio por gramo es obligatorio'
      }
    } else {
      if (!datosFormulario.precioUnidad || datosFormulario.precioUnidad <= 0) {
        nuevosErrores.precioUnidad = 'El precio por unidad es obligatorio'
      }
    }

    // Validar peso de envase para productos de peso fijo
    if (datosFormulario.tipoVenta === 'peso_fijo' && !datosFormulario.pesoEnvase.cantidad) {
      nuevosErrores.pesoEnvase = 'El peso del envase es obligatorio'
    }

    // Validar stock
    if (datosFormulario.stock.cantidad < 0) {
      nuevosErrores.stock = 'El stock no puede ser negativo'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  // Manejar cambio de archivo de imagen
  const handleArchivoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setArchivoImagen(file)
      setPreviewImagen(URL.createObjectURL(file))
    }
  }

  // Manejar selección de tags
  const handleTagClick = (tag) => {
    setDatosFormulario(prev => {
      const tags = [...prev.tags]
      if (tags.includes(tag)) {
        return { ...prev, tags: tags.filter(t => t !== tag) }
      } else {
        return { ...prev, tags: [...tags, tag] }
      }
    })
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    setCargando(true)
    let imageUrl = datosFormulario.imagen

    // Subir imagen si se seleccionó una nueva
    if (archivoImagen) {
      setSubiendo(true)
      const formData = new FormData()
      formData.append('imagen', archivoImagen)
      
      // Añadir el nombre del producto para que el servidor pueda crear un nombre de archivo basado en él
      formData.append('nombre', datosFormulario.nombre)

      try {
        const uploadResponse = await axios.post(`${API_URL}/upload`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        // La respuesta ahora incluye la ruta relativa para la base de datos
        imageUrl = uploadResponse.data.imageUrl
        
        console.log('Imagen guardada en:', imageUrl)
      } catch (uploadError) {
        console.error('Error al subir la imagen:', uploadError)
        Swal.fire({
          icon: 'error',
          title: 'Error al subir imagen',
          text: uploadError.response?.data?.message || 'No se pudo subir la imagen. Inténtalo de nuevo.'
        })
        setCargando(false)
        setSubiendo(false)
        return
      }
      setSubiendo(false)
    }

    // Preparar datos del producto
    const datosProducto = {
      ...datosFormulario,
      imagen: imageUrl,
      // Limpiar campos vacíos de información nutricional
      informacionNutricional: Object.fromEntries(
        Object.entries(datosFormulario.informacionNutricional).filter(([_, v]) => v !== '')
      )
    }

    try {
      let url = `${API_URL}/productos`
      let method = 'POST'
      
      if (productoInicial?._id) {
        url = `${API_URL}/productos/${productoInicial._id}`
        method = 'PUT'
      }

      const response = await axios({
        method,
        url,
        data: datosProducto,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      Swal.fire({
        icon: 'success',
        title: productoInicial ? 'Producto actualizado' : 'Producto creado',
        text: 'Los cambios se guardaron correctamente',
        timer: 2000,
        showConfirmButton: false
      })

      onGuardar()
      onCerrar()
    } catch (error) {
      console.error('Error al guardar producto:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: error.response?.data?.message || 'No se pudo guardar el producto'
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#5E3B00] bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-[#D3B178] w-full max-w-5xl max-h-[90vh] overflow-y-auto font-['Gabarito']">
        {/* Header - NO sticky para evitar problemas de superposición */}
        <div className="flex justify-between items-center p-6 border-b-2 border-[#D3B178] bg-[#815100]">
          <h2 className="text-2xl font-['Epilogue'] font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-[#088714] rounded-full flex items-center justify-center">
              <FaSave className="text-white text-sm" />
            </div>
            {productoInicial ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h2>
          <button
            onClick={onCerrar}
            className="text-white hover:text-white hover:bg-[#6e4300] p-2 rounded-lg transition-all duration-200"
            type="button"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Información Básica */}
          <div className="bg-[#815100] text-white p-6 rounded-xl border border-[#D3B178]">
            <h3 className="text-xl font-['Epilogue'] font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-6 h-6 bg-[#088714] rounded-full flex items-center justify-center">
                <FaInfoCircle className="text-white text-xs" />
              </div>
              Información Básica
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={datosFormulario.nombre}
                  onChange={manejarCambio}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-[#FFF8ED] text-[#3A2400] transition-all duration-200 font-['Gabarito'] ${
                    errores.nombre 
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-[#D3B178] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100]'
                  }`}
                  placeholder="Ej: Almendras crudas peladas"
                />
                {errores.nombre && (
                  <p className="text-red-600 text-sm mt-2 font-medium animate-fadeIn">{errores.nombre}</p>
                )}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoria"
                  value={datosFormulario.categoria}
                  onChange={manejarCambio}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-[#FFF8ED] text-[#3A2400] transition-all duration-200 font-['Gabarito'] ${
                    errores.categoria 
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-[#D3B178] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100]'
                  }`}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errores.categoria && (
                  <p className="text-red-600 text-sm mt-2 font-medium animate-fadeIn">{errores.categoria}</p>
                )}
              </div>
            </div>

            {/* Descripción */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-white mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descripcion"
                value={datosFormulario.descripcion}
                onChange={manejarCambio}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-xl bg-[#FFF8ED] text-[#3A2400] transition-all duration-200 font-['Gabarito'] resize-none ${
                  errores.descripcion 
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-[#D3B178] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100]'
                }`}
                placeholder="Describe este producto de manera clara y concisa. Incluye características y beneficios importantes."
              />
              {errores.descripcion && (
                <p className="text-red-600 text-sm mt-2 font-medium animate-fadeIn">{errores.descripcion}</p>
              )}
            </div>
          </div>

          {/* Tipo de Venta y Precios */}
          <div className="bg-[#815100] text-white p-6 rounded-xl border border-[#D3B178]">
            <h3 className="text-xl font-['Epilogue'] font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-6 h-6 bg-[#815100] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">$</span>
              </div>
              Tipo de Venta y Precios
            </h3>
            
            {/* Tipo de Venta */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-white mb-4">
                Tipo de Venta
              </label>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[
                  { 
                    value: 'unidad', 
                    label: 'Por Unidad', 
                    desc: 'Se vende por piezas individuales',
                    icon: '$'
                  },
                  { 
                    value: 'peso_variable', 
                    label: 'Peso Variable', 
                    desc: 'El cliente elige la cantidad',
                    icon: 'g'
                  },
                  { 
                    value: 'peso_fijo', 
                    label: 'Peso Fijo', 
                    desc: 'Envases de un peso predeterminado',
                    icon: 'kg'
                  }
                ].map(option => (
                  <div key={option.value} className="relative">
                    <input
                      type="radio"
                      name="tipoVenta"
                      id={`tipoVenta_${option.value}`}
                      value={option.value}
                      checked={datosFormulario.tipoVenta === option.value}
                      onChange={manejarCambio}
                      className="absolute opacity-0"
                    />
                    <label
                      htmlFor={`tipoVenta_${option.value}`}
                      className={`block p-4 border-2 rounded-xl bg-white text-[#3A2400] cursor-pointer transition-all duration-200 ${
                        datosFormulario.tipoVenta === option.value
                          ? 'border-[#088714] shadow-md'
                          : 'border-[#D3B178] hover:border-[#815100]'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${
                          datosFormulario.tipoVenta === option.value
                            ? 'bg-[#088714] text-white'
                            : 'bg-[#D3B178] text-[#3A2400]'
                        }`}>
                          <span className="font-bold">{option.icon}</span>
                        </div>
                        <div>
                          <span className="block font-semibold">{option.label}</span>
                          <span className="text-sm text-gray-600">{option.desc}</span>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Precios según el tipo de venta */}
            {datosFormulario.tipoVenta === 'peso_variable' ? (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">
                  Precio por Gramo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-0 top-0 flex items-center justify-center h-full w-10 text-[#3A2400] font-semibold bg-[#D3B178] rounded-l-xl border-r border-[#815100]">
                    $
                  </span>
                  <input
                    type="number"
                    name="precioGramo"
                    value={datosFormulario.precioGramo}
                    onChange={manejarCambio}
                    min="0.01"
                    step="0.01"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl bg-[#FFF8ED] text-[#3A2400] transition-all duration-200 font-['Gabarito'] ${
                      errores.precioGramo 
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-[#D3B178] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100]'
                    }`}
                    placeholder="0.00"
                  />
                  {errores.precioGramo && (
                    <p className="text-red-600 text-sm mt-2 font-medium animate-fadeIn">{errores.precioGramo}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">
                  Precio por {datosFormulario.tipoVenta === 'peso_fijo' ? 'Envase' : 'Unidad'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-0 top-0 flex items-center justify-center h-full w-10 text-[#3A2400] font-semibold bg-[#D3B178] rounded-l-xl border-r border-[#815100]">
                    $
                  </span>
                  <input
                    type="number"
                    name="precioUnidad"
                    value={datosFormulario.precioUnidad}
                    onChange={manejarCambio}
                    min="0"
                    step="1"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl bg-[#FFF8ED] text-[#3A2400] transition-all duration-200 font-['Gabarito'] ${
                      errores.precioUnidad 
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-[#D3B178] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100]'
                    }`}
                    placeholder="0"
                  />
                  {errores.precioUnidad && (
                    <p className="text-red-600 text-sm mt-2 font-medium animate-fadeIn">{errores.precioUnidad}</p>
                  )}
                </div>
              </div>
            )}

            {/* Peso del envase para productos de peso fijo */}
            {datosFormulario.tipoVenta === 'peso_fijo' && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-2">
                  Peso del Envase <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={datosFormulario.pesoEnvase.cantidad}
                    onChange={(e) => manejarCambioAnidado('pesoEnvase.cantidad', e.target.value)}
                    min="0"
                    step="1"
                    className={`flex-1 px-4 py-3 border-2 rounded-xl bg-[#FFF8ED] text-[#3A2400] transition-all duration-200 font-['Gabarito'] ${
                      errores.pesoEnvase 
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-[#D3B178] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100]'
                    }`}
                    placeholder="Ej: 250"
                  />
                  <select
                    value={datosFormulario.pesoEnvase.unidad}
                    onChange={(e) => manejarCambioAnidado('pesoEnvase.unidad', e.target.value)}
                    className="px-4 py-3 border-2 border-[#D3B178] rounded-xl bg-[#FFF8ED] text-[#3A2400] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 font-['Gabarito'] transition-all duration-200"
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                  </select>
                </div>
                {errores.pesoEnvase && (
                  <p className="text-red-600 text-sm mt-2 font-medium animate-fadeIn">{errores.pesoEnvase}</p>
                )}
              </div>
            )}

            {/* Opciones de venta a granel para productos de peso variable */}
            {datosFormulario.tipoVenta === 'peso_variable' && (
              <div className="mb-6 bg-white/30 p-4 rounded-lg border border-white/50">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="ventaGranel"
                    checked={datosFormulario.ventaGranel.disponible}
                    onChange={(e) => manejarCambioAnidado('ventaGranel.disponible', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="ventaGranel" className="font-medium text-white">
                    Disponible para venta a granel
                  </label>
                </div>

                {datosFormulario.ventaGranel.disponible && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white mb-2">
                        Cantidad Mínima
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={datosFormulario.ventaGranel.cantidadMinima}
                          onChange={(e) => manejarCambioAnidado('ventaGranel.cantidadMinima', Number(e.target.value))}
                          min="1"
                          className="flex-1 px-3 py-2 text-sm border-2 border-[#D3B178] rounded-lg bg-[#FFF8ED] text-[#3A2400] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 font-['Gabarito'] transition-all duration-200"
                        />
                        <select
                          value={datosFormulario.ventaGranel.unidad}
                          onChange={(e) => manejarCambioAnidado('ventaGranel.unidad', e.target.value)}
                          className="px-3 py-2 text-sm border-2 border-[#D3B178] rounded-lg bg-[#FFF8ED] text-[#3A2400] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 font-['Gabarito'] transition-all duration-200"
                        >
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white mb-2">
                        Incrementos
                      </label>
                      <input
                        type="number"
                        value={datosFormulario.ventaGranel.incrementos}
                        onChange={(e) => manejarCambioAnidado('ventaGranel.incrementos', Number(e.target.value))}
                        min="1"
                        className="w-full px-3 py-2 text-sm border-2 border-[#D3B178] rounded-lg bg-[#FFF8ED] text-[#3A2400] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 font-['Gabarito'] transition-all duration-200"
                        placeholder="Incrementos de selección (ej: 50)"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="bg-[#815100] text-white p-6 rounded-xl border border-[#D3B178]">
            <h3 className="text-xl font-['Epilogue'] font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-6 h-6 bg-[#815100] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">📦</span>
              </div>
              Gestión de Stock
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Cantidad Actual <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={datosFormulario.stock.cantidad}
                  onChange={(e) => manejarCambioAnidado('stock.cantidad', Number(e.target.value))}
                  min="0"
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-[#FFF8ED] text-[#3A2400] transition-all duration-200 font-['Gabarito'] text-center text-lg font-bold ${
                    errores.stock 
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-[#D3B178] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100]'
                  }`}
                />
                {errores.stock && (
                  <p className="text-red-600 text-sm mt-2 font-medium animate-fadeIn">{errores.stock}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Stock Mínimo
                </label>
                <input
                  type="number"
                  value={datosFormulario.stock.minimo}
                  onChange={(e) => manejarCambioAnidado('stock.minimo', Number(e.target.value))}
                  min="0"
                  className="w-full px-4 py-3 border-2 border-[#D3B178] rounded-xl bg-[#FFF8ED] text-[#3A2400] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100] font-['Gabarito'] text-center transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Unidad de Medida
                </label>
                <select
                  value={datosFormulario.stock.unidad}
                  onChange={(e) => manejarCambioAnidado('stock.unidad', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#D3B178] rounded-xl bg-[#FFF8ED] text-[#3A2400] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 font-['Gabarito'] transition-all duration-200"
                >
                  <option value="unidades">Unidades</option>
                  <option value="kg">Kilogramos</option>
                  <option value="g">Gramos</option>
                  <option value="l">Litros</option>
                  <option value="ml">Mililitros</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-[#815100] text-white p-6 rounded-xl border border-[#D3B178]">
            <h3 className="text-xl font-['Epilogue'] font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-6 h-6 bg-[#088714] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">#</span>
              </div>
              Etiquetas y Características
            </h3>
            
            <div className="flex flex-wrap gap-3">
              {tagsDisponibles.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
                    datosFormulario.tags.includes(tag)
                      ? 'bg-[#088714] text-white border-[#088714]'
                      : 'bg-white text-[#3A2400] border-[#D3B178] hover:border-[#815100]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Información Nutricional */}
          <div className="bg-[#815100] text-white p-6 rounded-xl border border-[#D3B178]">
            <h3 className="text-xl font-['Epilogue'] font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-6 h-6 bg-[#088714] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              Información Nutricional (por 100g)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: 'calorias', label: 'Calorías', unit: 'kcal', icon: '🔥' },
                { key: 'proteinas', label: 'Proteínas', unit: 'g', icon: '💪' },
                { key: 'grasas', label: 'Grasas', unit: 'g', icon: '🥑' },
                { key: 'carbohidratos', label: 'Carbohidratos', unit: 'g', icon: '🌾' },
                { key: 'fibra', label: 'Fibra', unit: 'g', icon: '🌿' },
                { key: 'sodio', label: 'Sodio', unit: 'mg', icon: '🧂' }
              ].map(item => (
                <div key={item.key} className="relative">
                  <label className="block text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <span>{item.icon}</span>
                    {item.label}
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={datosFormulario.informacionNutricional[item.key]}
                      onChange={(e) => manejarCambioAnidado(`informacionNutricional.${item.key}`, e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-[#D3B178] rounded-l-xl bg-[#FFF8ED] text-[#3A2400] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 font-['Gabarito'] transition-all duration-200"
                      placeholder="0"
                    />
                    <span className="px-4 py-3 bg-[#D3B178] text-[#3A2400] font-semibold border-2 border-l-0 border-[#D3B178] rounded-r-xl">
                      {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen */}
          <div className="bg-[#815100] text-white p-6 rounded-xl border border-[#D3B178]">
            <h3 className="text-xl font-['Epilogue'] font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-6 h-6 bg-[#088714] rounded-full flex items-center justify-center">
                <FaUpload className="text-white text-xs" />
              </div>
              Imagen del Producto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-white mb-3 font-['Gabarito']">
                  Seleccionar Imagen
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleArchivoChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full h-32 border-2 border-dashed border-[#D3B178] rounded-xl bg-white/20 flex flex-col items-center justify-center text-white hover:border-[#FFF8ED] hover:bg-white/30 transition-all duration-300">
                    <FaUpload size={20} className="mb-2" />
                    <span className="text-sm font-medium">Haz clic para seleccionar imagen</span>
                    <span className="text-xs mt-1 text-white/80">JPG, PNG o WEBP</span>
                  </div>
                </div>
                <div className="text-xs text-white mt-2">
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Tamaño máximo recomendado: 2MB</li>
                    <li>La imagen se nombrará automáticamente usando el nombre del producto</li>
                    <li>Recomendación: usar imágenes cuadradas para mejor visualización</li>
                  </ul>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-3 font-['Gabarito']">
                  {previewImagen ? 'Vista Previa' : 'Imagen Actual'}
                </label>
                {previewImagen ? (
                  <div className="w-full max-w-40 h-40 border-2 border-[#D3B178] rounded-xl overflow-hidden shadow-lg bg-white">
                    <img
                      src={previewImagen}
                      alt="Preview del producto"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/imgs/icons/placeholder.svg';
                      }}
                    />
                    <p className="text-xs text-[#088714] mt-2 font-medium flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-[#088714] rounded-full"></span>
                      {archivoImagen ? "Nueva imagen seleccionada" : "Imagen actual"}
                    </p>
                  </div>
                ) : (
                  <div className="w-full max-w-40 h-40 border-2 border-[#D3B178] rounded-xl overflow-hidden shadow-lg bg-[#FFF8ED] flex items-center justify-center">
                    <p className="text-sm text-[#3A2400] text-center p-4">
                      No hay imagen seleccionada
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Estado del Producto */}
          <div className="bg-[#815100] text-white p-6 rounded-xl border border-[#D3B178]">
            <h3 className="text-xl font-['Epilogue'] font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-6 h-6 bg-[#088714] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              Estado del Producto
            </h3>
            
            <div className="bg-white p-4 rounded-lg border border-[#D3B178]/30">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={datosFormulario.activo}
                    onChange={manejarCambio}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    datosFormulario.activo ? 'bg-[#088714]' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      datosFormulario.activo ? 'translate-x-6' : ''
                    }`}></div>
                  </div>
                </div>
                <div>
                  <span className={`font-semibold text-sm ${
                    datosFormulario.activo ? 'text-[#088714]' : 'text-gray-500'
                  }`}>
                    {datosFormulario.activo ? 'Producto Activo' : 'Producto Inactivo'}
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {datosFormulario.activo 
                      ? 'El producto está visible y disponible para compra'
                      : 'El producto no se mostrará al público'
                    }
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col md:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={onCerrar}
              className="px-6 py-3 rounded-xl border-2 border-[#D3B178] text-[#3A2400] hover:bg-[#FFF8ED] transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className={`px-8 py-3 rounded-xl bg-[#815100] text-white flex items-center justify-center gap-3 ${
                cargando ? 'opacity-80' : 'hover:bg-[#5E3B00]'
              } transition-colors duration-200`}
            >
              {subiendo ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  <span>Subiendo imagen...</span>
                </>
              ) : cargando ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <FaSave size={18} />
                  <span>Guardar Producto</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductoForm
