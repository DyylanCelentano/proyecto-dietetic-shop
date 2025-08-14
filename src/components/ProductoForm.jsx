import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaInfoCircle, FaSave, FaTimes, FaUpload } from 'react-icons/fa'
import Swal from 'sweetalert2'

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
          axios.get('http://localhost:5000/api/productos/categorias'),
          axios.get('http://localhost:5000/api/productos/tags')
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
      setPreviewImagen(productoInicial.imagen)
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

  // Handler para archivos de imagen
  // Handler para archivos de imagen
  const handleArchivoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrores(prev => ({ ...prev, imagen: 'La imagen no puede ser mayor a 5MB' }))
        return
      }
      
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        setErrores(prev => ({ ...prev, imagen: 'Solo se permiten imágenes JPG, PNG o WEBP' }))
        return
      }
      
      setArchivoImagen(file)
      setPreviewImagen(URL.createObjectURL(file))
      setErrores(prev => ({ ...prev, imagen: '' }))
    }
  }

  // Handler para tags
  const handleTagClick = (tag) => {
    const nuevosTags = datosFormulario.tags.includes(tag)
      ? datosFormulario.tags.filter(t => t !== tag)
      : [...datosFormulario.tags, tag]
    
    setDatosFormulario(prev => ({ ...prev, tags: nuevosTags }))
  }

  // Handler para submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      Swal.fire({
        icon: 'error',
        title: 'Errores en el formulario',
        text: 'Por favor, corrige los errores antes de continuar'
      })
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
        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
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
      let url = 'http://localhost:5000/api/productos'
      let method = 'POST'
      
      if (productoInicial?._id) {
        url = `http://localhost:5000/api/productos/${productoInicial._id}`
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
        <div className="flex justify-between items-center p-6 border-b-2 border-[#D3B178] bg-[#5E3B00]">
          <h2 className="text-2xl font-['Epilogue'] font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-[#088714] rounded-full flex items-center justify-center">
              <FaSave className="text-white text-sm" />
            </div>
            {productoInicial ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h2>
          <button
            onClick={onCerrar}
            className="text-white hover:text-[#F8E6CF] hover:bg-[#6e4300] p-2 rounded-lg transition-all duration-200"
            type="button"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Información Básica */}
          <div className="bg-[#5E3B00] text-[#F8E6CF] p-6 rounded-xl border border-[#4D3000]">
            <h3 className="text-xl font-['Epilogue'] font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-6 h-6 bg-[#088714] rounded-full flex items-center justify-center">
                <FaInfoCircle className="text-white text-xs" />
              </div>
              Información Básica
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-[#F8E6CF] mb-2">
                  Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={datosFormulario.nombre}
                  onChange={manejarCambio}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-[#FFF8ED]/50 transition-all duration-200 font-['Gabarito'] ${
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
                <label className="block text-sm font-semibold text-[#F8E6CF] mb-2">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoria"
                  value={datosFormulario.categoria}
                  onChange={manejarCambio}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-[#FFF8ED]/50 transition-all duration-200 font-['Gabarito'] ${
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
              <label className="block text-sm font-semibold text-[#F8E6CF] mb-2">
                Descripción <span className="text-red-500">*</span>
              </label>
              <textarea
                name="descripcion"
                value={datosFormulario.descripcion}
                onChange={manejarCambio}
                rows={4}
                className={`w-full px-4 py-3 border-2 rounded-xl bg-[#FFF8ED]/50 transition-all duration-200 font-['Gabarito'] resize-none ${
                  errores.descripcion 
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                    : 'border-[#D3B178] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100]'
                }`}
                placeholder="Describe las características y beneficios del producto..."
              />
              {errores.descripcion && (
                <p className="text-red-600 text-sm mt-2 font-medium animate-fadeIn">{errores.descripcion}</p>
              )}
            </div>
          </div>

          {/* Tipo de Venta y Precios */}
          <div className="bg-[#5E3B00] text-[#F8E6CF] p-6 rounded-xl border border-[#4D3000]">
            <h3 className="text-xl font-['Epilogue'] font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-6 h-6 bg-[#815100] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">$</span>
              </div>
              Tipo de Venta y Precios
            </h3>
            
            {/* Tipo de Venta */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#4D3000] mb-4">
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
                    desc: 'Envases con peso predefinido',
                    icon: 'kg'
                  }
                ].map(tipo => (
                  <label
                    key={tipo.value}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      datosFormulario.tipoVenta === tipo.value
                        ? 'border-[#088714] bg-[#088714]/10 shadow-lg ring-2 ring-[#088714]/20'
                        : 'border-[#D3B178] hover:border-[#815100] hover:bg-[#FFF8ED]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoVenta"
                      value={tipo.value}
                      checked={datosFormulario.tipoVenta === tipo.value}
                      onChange={manejarCambio}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-sm mb-2 text-[#815100] font-bold">{tipo.icon}</div>
                      <div className="font-['Epilogue'] font-bold text-[#5E3B00] text-sm mb-1">{tipo.label}</div>
                      <div className="text-xs text-[#815100] leading-relaxed">{tipo.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Precios según tipo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {datosFormulario.tipoVenta === 'peso_variable' ? (
                <div>
                  <label className="block text-sm font-semibold text-[#F8E6CF] mb-2">
                    Precio por Gramo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#815100] font-bold">$</span>
                    <input
                      type="number"
                      name="precioGramo"
                      value={datosFormulario.precioGramo}
                      onChange={manejarCambio}
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl bg-[#FFF8ED]/50 transition-all duration-200 font-['Gabarito'] ${
                        errores.precioGramo 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-[#D3B178] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100]'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errores.precioGramo && (
                    <p className="text-red-600 text-sm mt-2 font-medium animate-fadeIn">{errores.precioGramo}</p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-[#F8E6CF] mb-2">
                    Precio por Unidad <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#815100] font-bold">$</span>
                    <input
                      type="number"
                      name="precioUnidad"
                      value={datosFormulario.precioUnidad}
                      onChange={manejarCambio}
                      step="0.01"
                      min="0"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl bg-[#FFF8ED]/50 transition-all duration-200 font-['Gabarito'] ${
                        errores.precioUnidad 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-[#D3B178] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100]'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errores.precioUnidad && (
                    <p className="text-red-600 text-sm mt-2 font-medium animate-fadeIn">{errores.precioUnidad}</p>
                  )}
                </div>
              )}

              {/* Peso de Envase para peso fijo */}
              {datosFormulario.tipoVenta === 'peso_fijo' && (
                <div>
                  <label className="block text-sm font-semibold text-[#F8E6CF] mb-2">
                    Peso del Envase <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={datosFormulario.pesoEnvase.cantidad}
                      onChange={(e) => manejarCambioAnidado('pesoEnvase.cantidad', e.target.value)}
                      min="0"
                      step="0.01"
                      className={`flex-1 px-4 py-3 border-2 rounded-xl bg-[#FFF8ED]/50 transition-all duration-200 font-['Gabarito'] ${
                        errores.pesoEnvase 
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-[#D3B178] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100]'
                      }`}
                      placeholder="500"
                    />
                    <select
                      value={datosFormulario.pesoEnvase.unidad}
                      onChange={(e) => manejarCambioAnidado('pesoEnvase.unidad', e.target.value)}
                      className="px-4 py-3 border-2 border-[#D3B178] rounded-xl bg-[#FFF8ED]/50 focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 font-['Gabarito'] transition-all duration-200"
                    >
                      <option value="g">gramos</option>
                      <option value="kg">kilogramos</option>
                    </select>
                  </div>
                  {errores.pesoEnvase && (
                    <p className="text-red-600 text-sm mt-2 font-medium animate-fadeIn">{errores.pesoEnvase}</p>
                  )}
                </div>
              )}
            </div>

            {/* Venta a Granel */}
            {datosFormulario.tipoVenta !== 'unidad' && (
              <div className="mt-6 p-4 bg-[#FFF8ED]/60 rounded-xl border border-[#D3B178]/50">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="ventaGranel"
                      checked={datosFormulario.ventaGranel.disponible}
                      onChange={(e) => manejarCambioAnidado('ventaGranel.disponible', e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                      datosFormulario.ventaGranel.disponible 
                        ? 'bg-[#088714] border-[#088714]' 
                        : 'border-[#D3B178] group-hover:border-[#815100]'
                    }`}>
                      {datosFormulario.ventaGranel.disponible && (
                        <svg className="w-3 h-3 text-white mt-0.5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#4D3000] group-hover:text-[#5E3B00] transition-colors">
                    Disponible para venta a granel
                  </span>
                </label>
                
                {datosFormulario.ventaGranel.disponible && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-semibold text-[#815100] mb-2 uppercase tracking-wide">
                        Cantidad Mínima
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={datosFormulario.ventaGranel.cantidadMinima}
                          onChange={(e) => manejarCambioAnidado('ventaGranel.cantidadMinima', e.target.value)}
                          min="0"
                          step="0.01"
                          className="flex-1 px-3 py-2 text-sm border-2 border-[#D3B178] rounded-lg bg-[#FFF8ED]/50 focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 font-['Gabarito'] transition-all duration-200"
                          placeholder="50"
                        />
                        <select
                          value={datosFormulario.ventaGranel.unidad}
                          onChange={(e) => manejarCambioAnidado('ventaGranel.unidad', e.target.value)}
                          className="px-3 py-2 text-sm border-2 border-[#D3B178] rounded-lg bg-[#FFF8ED]/50 focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 font-['Gabarito'] transition-all duration-200"
                        >
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-semibold text-[#815100] mb-2 uppercase tracking-wide">
                        Incrementos
                      </label>
                      <input
                        type="number"
                        value={datosFormulario.ventaGranel.incrementos}
                        onChange={(e) => manejarCambioAnidado('ventaGranel.incrementos', e.target.value)}
                        min="1"
                        step="1"
                        className="w-full px-3 py-2 text-sm border-2 border-[#D3B178] rounded-lg bg-[#FFF8ED]/50 focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 font-['Gabarito'] transition-all duration-200"
                        placeholder="50"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="bg-[#5E3B00] text-[#F8E6CF] p-6 rounded-xl border border-[#4D3000]">
            <h3 className="text-xl font-['Epilogue'] font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-6 h-6 bg-[#815100] rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">📦</span>
              </div>
              Gestión de Stock
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#F8E6CF] mb-2">
                  Cantidad Actual <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={datosFormulario.stock.cantidad}
                  onChange={(e) => manejarCambioAnidado('stock.cantidad', e.target.value)}
                  min="0"
                  step="1"
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-[#FFF8ED]/50 transition-all duration-200 font-['Gabarito'] text-center text-lg font-bold ${
                    errores.stock 
                      ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                      : 'border-[#D3B178] focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100]'
                  }`}
                  placeholder="0"
                />
                {errores.stock && (
                  <p className="text-red-600 text-sm mt-2 font-medium animate-fadeIn">{errores.stock}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#F8E6CF] mb-2">
                  Stock Mínimo
                </label>
                <input
                  type="number"
                  value={datosFormulario.stock.minimo}
                  onChange={(e) => manejarCambioAnidado('stock.minimo', e.target.value)}
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border-2 border-[#D3B178] rounded-xl bg-[#FFF8ED]/50 focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 hover:border-[#815100] font-['Gabarito'] text-center transition-all duration-200"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#F8E6CF] mb-2">
                  Unidad de Stock
                </label>
                <select
                  value={datosFormulario.stock.unidad}
                  onChange={(e) => manejarCambioAnidado('stock.unidad', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#D3B178] rounded-xl bg-[#FFF8ED]/50 focus:border-[#815100] focus:ring-2 focus:ring-[#815100]/20 font-['Gabarito'] transition-all duration-200"
                >
                  <option value="unidades">🔢 Unidades</option>
                  <option value="kg">⚖️ Kilogramos</option>
                  <option value="g">📏 Gramos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-[#5E3B00] text-[#F8E6CF] p-6 rounded-xl border border-[#4D3000]">
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
                      ? 'bg-[#088714] text-white border-[#088714] shadow-lg transform scale-105'
                      : 'bg-[#FFF8ED] text-[#815100] border-[#D3B178] hover:border-[#815100] hover:bg-white hover:shadow-md hover:scale-105'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {datosFormulario.tags.length > 0 && (
              <div className="mt-4 p-4 bg-[#088714]/5 rounded-lg border border-[#088714]/20">
                <p className="text-sm font-semibold text-[#088714] mb-2">🏷️ Etiquetas seleccionadas:</p>
                <div className="flex flex-wrap gap-2">
                  {datosFormulario.tags.map(tag => (
                    <span key={tag} className="inline-block bg-[#088714] text-white px-3 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Información Nutricional */}
          <div className="bg-[#5E3B00] text-[#F8E6CF] p-6 rounded-xl border border-[#4D3000]">
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
              ].map(nutriente => (
                <div key={nutriente.key} className="bg-white p-4 rounded-lg border border-[#D3B178]/30">
                  <label className="flex items-center gap-2 text-sm font-bold text-[#5E3B00] mb-3 font-['Gabarito']">
                    <span>{nutriente.icon}</span>
                    {nutriente.label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={datosFormulario.informacionNutricional[nutriente.key]}
                      onChange={(e) => manejarCambioAnidado(`informacionNutricional.${nutriente.key}`, e.target.value)}
                      step="0.01"
                      min="0"
                      className="w-full p-3 pr-14 border-2 border-[#D3B178] rounded-lg font-['Gabarito'] transition-all duration-300 focus:outline-none focus:border-[#815100] focus:bg-white"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-3 text-[#815100] text-sm font-semibold">
                      {nutriente.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Imagen */}
          <div className="bg-[#5E3B00] text-[#F8E6CF] p-6 rounded-xl border border-[#4D3000]">
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
                    className="block w-full text-sm text-[#5E3B00] file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-2 file:border-[#D3B178] file:text-sm file:font-bold file:bg-[#FFF8ED] file:text-[#815100] hover:file:bg-white hover:file:border-[#815100] transition-all duration-200 font-['Gabarito'] cursor-pointer"
                  />
                </div>
                {errores.imagen && (
                  <p className="text-red-500 text-sm mt-2 font-medium bg-red-50 p-2 rounded-lg border border-red-200">
                    {errores.imagen}
                  </p>
                )}
                <div className="mt-4 p-3 bg-[#FFF1D9] rounded-lg border border-[#D3B178] text-xs text-[#815100]">
                  <p className="font-semibold mb-1">📁 Información sobre las imágenes:</p>
                  <ul className="list-disc ml-4 space-y-1">
                    <li>Formatos permitidos: JPG, PNG, WEBP</li>
                    <li>Tamaño máximo: 5MB</li>
                    <li>Se guardará en: <code className="bg-white px-1 py-0.5 rounded">imgs/products/</code></li>
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
                    />
                    <p className="text-xs text-[#088714] mt-2 font-medium flex items-center gap-1">
                      <span className="inline-block w-2 h-2 bg-[#088714] rounded-full"></span>
                      Nueva imagen seleccionada
                    </p>
                  </div>
                ) : datosFormulario.imagen ? (
                  <div className="w-full max-w-40 h-40 border-2 border-[#D3B178] rounded-xl overflow-hidden shadow-lg bg-white">
                    <img
                      src={datosFormulario.imagen.startsWith('/') ? datosFormulario.imagen : `/${datosFormulario.imagen}`}
                      alt={datosFormulario.nombre || "Imagen del producto"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = '/imgs/icons/placeholder.svg'
                      }}
                    />
                    <p className="text-xs text-[#815100] mt-2 font-medium">
                      {datosFormulario.imagen.split('/').pop()}
                    </p>
                  </div>
                ) : (
                  <div className="w-full max-w-40 h-40 border-2 border-[#D3B178] rounded-xl overflow-hidden shadow-lg bg-[#FFF8ED] flex items-center justify-center">
                    <p className="text-sm text-[#815100] px-4 text-center">No hay imagen seleccionada</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Estado del Producto */}
          <div className="bg-[#5E3B00] text-[#F8E6CF] p-6 rounded-xl border border-[#4D3000]">
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
                  <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                    datosFormulario.activo 
                      ? 'bg-[#088714] border-[#088714] text-white' 
                      : 'border-[#D3B178] group-hover:border-[#815100]'
                  }`}>
                    {datosFormulario.activo && (
                      <span className="text-white text-sm font-bold">✓</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-bold text-[#5E3B00] font-['Gabarito']">
                    Producto activo (visible en la tienda)
                  </span>
                  <p className="text-xs text-[#815100] mt-1">
                    {datosFormulario.activo 
                      ? "El producto aparecerá en la tienda y estará disponible para compra" 
                      : "El producto estará oculto y no se podrá comprar"
                    }
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4 pt-6 border-t border-[#D3B178]/50">
            <button
              type="button"
              onClick={onCerrar}
              className="px-6 py-3 text-white bg-[#815100] border-2 border-[#A66E1F] rounded-lg hover:bg-[#6e4300] hover:border-[#6e4300] transition-all duration-200 font-['Gabarito'] font-bold"
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando || subiendo}
              className="px-6 py-3 bg-[#088714] text-white rounded-lg hover:bg-[#066610] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-['Gabarito'] font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {subiendo ? (
                <>
                  <FaUpload className="animate-spin" />
                  Subiendo imagen...
                </>
              ) : cargando ? (
                <>
                  <FaSave className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave />
                  {productoInicial ? 'Actualizar' : 'Crear'} Producto
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
