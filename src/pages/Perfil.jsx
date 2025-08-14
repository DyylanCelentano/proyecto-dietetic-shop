import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaCog, FaEdit, FaEye, FaEyeSlash, FaHistory, FaLock, FaSignOutAlt, FaSpinner, FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import PedidoItem from '../components/PedidoItem'
import { NoOrders } from '../components/ui'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../hooks/useAuth'

const Perfil = () => {
  const { usuario, cerrarSesion, actualizarUsuario } = useAuth()
  const navigate = useNavigate()
  const { mostrarExito, mostrarError } = useToast()
  
  const [activeTab, setActiveTab] = useState('info')
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(false)
  const [editando, setEditando] = useState(false)
  const [loadingPerfil, setLoadingPerfil] = useState(true)
  const [datosUsuario, setDatosUsuario] = useState({
    username: '',
    email: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: {
      calle: '',
      numero: '',
      piso: '',
      departamento: '',
      ciudad: '',
      provincia: '',
      codigoPostal: ''
    }
  })

  // Cargar datos del usuario desde la API
  useEffect(() => {
    // Prevenir ejecución si no hay usuario
    if (!usuario) return
    
    let isMounted = true
    
    const cargarPerfilUsuario = async () => {
      setLoadingPerfil(true)
      try {
        // Intentar obtener los datos más actualizados de la API
        const token = localStorage.getItem('token')
        if (token) {
          try {
            const { data } = await axios.get('http://localhost:5000/api/auth/perfil', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            
            if (isMounted && data.exito && data.usuario) {
              // Actualizar el contexto con los datos más recientes
              actualizarUsuario(data.usuario)
              
              // Actualizar el estado local
              setDatosUsuario({
                username: data.usuario.username || '',
                email: data.usuario.email || '',
                nombre: data.usuario.nombre || '',
                apellido: data.usuario.apellido || '',
                telefono: data.usuario.telefono || '',
                direccion: data.usuario.direccion || {
                  calle: '',
                  numero: '',
                  piso: '',
                  departamento: '',
                  ciudad: '',
                  provincia: '',
                  codigoPostal: ''
                }
              })
            }
          } catch (apiError) {
            console.error('Error al obtener perfil de la API:', apiError)
            // Si falla la API, continuar con datos del localStorage
          }
        }
        
        // Si no hay datos de la API, usar los del localStorage
            if (isMounted && !datosUsuario.username) {
          setDatosUsuario({
            username: usuario.username || '',
            email: usuario.email || '',
            nombre: usuario.nombre || '',
            apellido: usuario.apellido || '',
            telefono: usuario.telefono || '',
            direccion: usuario.direccion && typeof usuario.direccion === 'object' ? usuario.direccion : {
              calle: '',
              numero: '',
              piso: '',
              departamento: '',
              ciudad: '',
              provincia: '',
              codigoPostal: ''
            },
          })
        }        // Si el usuario está autenticado, cargar sus pedidos una única vez
        if (isMounted && usuario._id) {
          fetchPedidos()
        }
      } catch (error) {
        console.error('Error al cargar datos del perfil:', error)
        if (isMounted) mostrarError('No se pudieron cargar los datos del perfil')
      } finally {
        if (isMounted) setLoadingPerfil(false)
      }
    }
    
    cargarPerfilUsuario()
    
    // Cleanup function para evitar actualizaciones de estado en componentes desmontados
    return () => {
      isMounted = false
    }
  }, [usuario?._id, mostrarError]) // Dependencias reducidas para evitar bucles
  
  // Función para obtener el historial de pedidos
  const fetchPedidos = async () => {
    if (!usuario || !usuario._id) return
    
    try {
      setLoading(true)
      
      // Intentar obtener los pedidos actualizados de la API
      let pedidosEncontrados = false
      
      try {
        // Verificar si el endpoint existe o debemos saltarnos la llamada
        const endpointExists = localStorage.getItem('pedidosEndpointExists')
        
        if (endpointExists !== 'false') {
          const token = localStorage.getItem('token')
          const { data } = await axios.get(`http://localhost:5000/api/pedidos/usuario/${usuario._id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          
          // Si llegamos aquí, el endpoint existe
          localStorage.setItem('pedidosEndpointExists', 'true')
          
          if (data && Array.isArray(data) && data.length > 0) {
            setPedidos(data)
            pedidosEncontrados = true
            return
          }
        }
      } catch (apiError) {
        // Marcar el endpoint como no disponible para evitar llamadas repetidas
        localStorage.setItem('pedidosEndpointExists', 'false')
        console.error('Error al obtener pedidos de la API:', apiError)
      }
      
      // Si no encontramos pedidos en la API, intentar obtenerlos del usuario
      // Primero, intentamos obtener el perfil actualizado por si hay cambios
      try {
        const token = localStorage.getItem('token')
        const { data } = await axios.get('http://localhost:5000/api/auth/perfil', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        if (data.exito && data.usuario) {
          // Actualizar el contexto con los datos más recientes
          actualizarUsuario(data.usuario)
          
          // Verificar si hay pedidos en el perfil actualizado
          if (data.usuario.pedidos && Array.isArray(data.usuario.pedidos) && data.usuario.pedidos.length > 0) {
            setPedidos(data.usuario.pedidos)
            pedidosEncontrados = true
            return
          }
        }
      } catch (perfilError) {
        console.error('Error al obtener perfil actualizado:', perfilError)
      }
      
      // Si no encontramos pedidos en el perfil actualizado, usar los del estado actual del usuario
      if (usuario && usuario.pedidos && Array.isArray(usuario.pedidos) && usuario.pedidos.length > 0) {
        setPedidos(usuario.pedidos)
        pedidosEncontrados = true
        return
      }
      
      // Si no hay pedidos reales, mostrar datos simulados solo en entorno de desarrollo
      if (!pedidosEncontrados && process.env.NODE_ENV === 'development') {
        const datosDePrueba = [
          {
            _id: 'sim1',
            pedidoId: 'sim1',
            fecha: new Date().toISOString(),
            estado: 'entregado',
            total: 15500,
            productos: [
              { nombre: 'Aceite de Coco Orgánico', cantidad: 1, precio: 8500, imagen: 'aceite-coco.webp' },
              { nombre: 'Azúcar de Coco', cantidad: 2, precio: 3500, imagen: 'azucar-coco.webp' }
            ]
          },
          {
            _id: 'sim2',
            pedidoId: 'sim2',
            fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 semana atrás
            estado: 'procesando',
            total: 9800,
            productos: [
              { nombre: 'Mix de Frutos Secos Premium', cantidad: 1, precio: 9800, imagen: 'mix-frutos.webp' }
            ]
          }
        ]
        
        setPedidos(datosDePrueba)
        mostrarExito('Mostrando datos de ejemplo (modo desarrollo)')
      } else if (!pedidosEncontrados) {
        setPedidos([])
      }
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
      mostrarError('Error al cargar el historial de pedidos')
      setPedidos([])
    } finally {
      setLoading(false)
    }
  }
  
  // Manejo del formulario de edición
  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Verificar si el campo es parte de la dirección
    if (name.startsWith('direccion.')) {
      const direccionField = name.split('.')[1]
      setDatosUsuario(prev => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [direccionField]: value
        }
      }))
    } else {
      // Campos normales
      setDatosUsuario(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }
  
  // Guardar cambios en el perfil
  const handleSubmitPerfil = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const token = localStorage.getItem('token')
      const { data } = await axios.put(
        `http://localhost:5000/api/auth/perfil`, 
        datosUsuario,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      if (data.exito) {
        // Actualizar datos en el contexto de autenticación
        actualizarUsuario({
          ...usuario,
          ...datosUsuario
        })
        
        setEditando(false)
        mostrarExito('Datos actualizados correctamente')
      } else {
        mostrarError(data.mensaje || 'Error al actualizar los datos')
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      mostrarError(error.response?.data?.mensaje || 'Error al actualizar los datos')
    } finally {
      setLoading(false)
    }
  }
  
  // Estados para la contraseña y visibilidad
  const [newPassword, setNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Cambio de contraseña
  const handleCambioPassword = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const passwordActual = formData.get('passwordActual')
    const passwordNuevo = formData.get('passwordNuevo')
    const passwordConfirm = formData.get('passwordConfirm')
    
    if (passwordNuevo !== passwordConfirm) {
      mostrarError('Las contraseñas no coinciden')
      return
    }
    
    try {
      setLoading(true)
      
        const token = localStorage.getItem('token')
      console.log('ID de usuario a enviar:', usuario._id)
      const { data } = await axios.post(
        `http://localhost:5000/api/auth/cambiar-password`, 
        {
          usuarioId: usuario._id,
          passwordActual,
          passwordNuevo
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      if (data.exito) {
        e.target.reset()
        mostrarExito('Contraseña actualizada correctamente')
      } else {
        mostrarError(data.mensaje || 'Error al actualizar la contraseña')
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      mostrarError(error.response?.data?.mensaje || 'Error al actualizar la contraseña. Revisá los datos ingresados.')
    } finally {
      setLoading(false)
    }
  }
  
  // Eliminar cuenta
  const handleEliminarCuenta = async () => {
    if (window.confirm('¿Estás seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        setLoading(true)
        
        const token = localStorage.getItem('token')
        const { data } = await axios.delete(
          `http://localhost:5000/api/usuarios/${usuario._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        
        if (data.exito) {
          cerrarSesion()
          navigate('/')
          mostrarExito('Cuenta eliminada correctamente')
        } else {
          mostrarError(data.mensaje || 'Error al eliminar la cuenta')
        }
      } catch (error) {
        console.error('Error al eliminar cuenta:', error)
        mostrarError(error.response?.data?.mensaje || 'Error al eliminar la cuenta')
      } finally {
        setLoading(false)
      }
    }
  }
  
  // Desactivar cuenta
  const handleDesactivarCuenta = async () => {
    if (window.confirm('¿Estás seguro que deseas desactivar tu cuenta? Podrás reactivarla más adelante.')) {
      try {
        setLoading(true)
        
        const token = localStorage.getItem('token')
        const { data } = await axios.patch(
          `http://localhost:5000/api/usuarios/${usuario._id}/desactivar`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        
        if (data.exito) {
          cerrarSesion()
          navigate('/')
          mostrarExito('Cuenta desactivada correctamente')
        } else {
          mostrarError(data.mensaje || 'Error al desactivar la cuenta')
        }
      } catch (error) {
        console.error('Error al desactivar cuenta:', error)
        mostrarError(error.response?.data?.mensaje || 'Error al desactivar la cuenta')
      } finally {
        setLoading(false)
      }
    }
  }
  
  // Mostrar pantalla de carga o redirección si no hay usuario
  if (loadingPerfil) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFF8ED]">
        <div className="text-center">
          <FaSpinner className="animate-spin mx-auto h-12 w-12 text-[#D3B178] mb-4" />
          <p className="text-lg text-[#5E3B00]">Cargando perfil...</p>
        </div>
      </div>
    )
  }
  
  if (!usuario) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#FFF8ED]">
        <div className="text-center">
          <p className="text-lg text-[#5E3B00] mb-4">Debes iniciar sesión para ver tu perfil</p>
          <button 
            onClick={() => navigate('/login')} 
            className="px-6 py-2 bg-[#D3B178] text-[#3A2400] rounded-lg hover:bg-[#b39869] transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#FFF8ED] py-6 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4 max-w-6xl">
        <h1 className="font-['Gabarito'] text-[#5E3B00] text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-center">
          Mi Perfil
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header del perfil */}
          <div className="bg-[#D3B178] p-4 sm:p-6 md:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-[#5E3B00] mx-auto flex items-center justify-center">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white uppercase">
                {usuario.username ? usuario.username.charAt(0) : (usuario.nombre ? usuario.nombre.charAt(0) : 'U')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#3A2400] mt-3 sm:mt-4">
              {usuario.username || 'Usuario'}
            </h2>
            <p className="text-[#5E3B00] text-sm sm:text-base break-words">{usuario.email}</p>
            {(usuario.nombre || usuario.apellido) && (
              <p className="text-[#815100] text-xs sm:text-sm mt-1">
                {usuario.nombre} {usuario.apellido}
              </p>
            )}
          </div>
          
          {/* Navegación por tabs - Versión mejorada para móviles */}
          <div className="bg-[#FFF1D9] border-b border-[#D3B178]">
            {/* Versión móvil: Grid de 2x2 */}
            <div className="grid grid-cols-2 gap-1 p-2 md:hidden">
              <button 
                onClick={() => setActiveTab('info')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  activeTab === 'info' 
                    ? 'bg-white shadow-sm font-semibold text-[#5E3B00]' 
                    : 'hover:bg-white/50 text-[#815100]'
                }`}
              >
                <FaUser className="text-lg mb-1" />
                <span className="text-xs">Perfil</span>
              </button>
              
              <button 
                onClick={() => {
                  setActiveTab('pedidos')
                  fetchPedidos()
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  activeTab === 'pedidos' 
                    ? 'bg-white shadow-sm font-semibold text-[#5E3B00]' 
                    : 'hover:bg-white/50 text-[#815100]'
                }`}
              >
                <FaHistory className="text-lg mb-1" />
                <span className="text-xs">Pedidos</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('seguridad')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  activeTab === 'seguridad' 
                    ? 'bg-white shadow-sm font-semibold text-[#5E3B00]' 
                    : 'hover:bg-white/50 text-[#815100]'
                }`}
              >
                <FaLock className="text-lg mb-1" />
                <span className="text-xs">Seguridad</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('cuenta')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  activeTab === 'cuenta' 
                    ? 'bg-white shadow-sm font-semibold text-[#5E3B00]' 
                    : 'hover:bg-white/50 text-[#815100]'
                }`}
              >
                <FaCog className="text-lg mb-1" />
                <span className="text-xs">Cuenta</span>
              </button>
            </div>
            
            {/* Versión tablet/desktop: Tabs horizontales */}
            <div className="hidden md:flex overflow-x-auto custom-scrollbar space-x-4 px-4 py-2">
              <button 
                onClick={() => setActiveTab('info')}
                className={`whitespace-nowrap px-4 py-2 rounded-t-lg transition-colors flex-shrink-0 ${
                  activeTab === 'info' 
                    ? 'bg-white font-semibold text-[#5E3B00]' 
                    : 'hover:bg-white/50 text-[#815100]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FaUser className="text-base" />
                  <span>Información Personal</span>
                </span>
              </button>
              
              <button 
                onClick={() => {
                  setActiveTab('pedidos')
                  fetchPedidos()
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-t-lg transition-colors flex-shrink-0 ${
                  activeTab === 'pedidos' 
                    ? 'bg-white font-semibold text-[#5E3B00]' 
                    : 'hover:bg-white/50 text-[#815100]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FaHistory className="text-base" />
                  <span>Mis Pedidos</span>
                </span>
              </button>
              
              <button 
                onClick={() => setActiveTab('seguridad')}
                className={`whitespace-nowrap px-4 py-2 rounded-t-lg transition-colors flex-shrink-0 ${
                  activeTab === 'seguridad' 
                    ? 'bg-white font-semibold text-[#5E3B00]' 
                    : 'hover:bg-white/50 text-[#815100]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FaLock className="text-base" />
                  <span>Seguridad</span>
                </span>
              </button>
              
              <button 
                onClick={() => setActiveTab('cuenta')}
                className={`whitespace-nowrap px-4 py-2 rounded-t-lg transition-colors flex-shrink-0 ${
                  activeTab === 'cuenta' 
                    ? 'bg-white font-semibold text-[#5E3B00]' 
                    : 'hover:bg-white/50 text-[#815100]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FaCog className="text-base" />
                  <span>Cuenta</span>
                </span>
              </button>
            </div>
          </div>
          
          {/* Contenido de las tabs */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Tab de Información Personal */}
            {activeTab === 'info' && (
              <div>
                <div className="flex flex-wrap justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#5E3B00] mb-2 sm:mb-0">Información Personal</h3>
                  {!editando && (
                    <button 
                      onClick={() => setEditando(true)}
                      className="flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#D3B178] text-[#3A2400] text-sm sm:text-base rounded-lg hover:bg-[#b39869] transition-colors"
                    >
                      <FaEdit />
                      Editar
                    </button>
                  )}
                </div>
                
                <form onSubmit={handleSubmitPerfil}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-[#5E3B00] font-medium text-sm sm:text-base mb-1">Usuario</label>
                      <input
                        type="text"
                        name="username"
                        value={datosUsuario.username}
                        onChange={handleChange}
                        disabled={!editando}
                        className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${
                          editando ? 'border-[#D3B178]' : 'bg-gray-50 border-gray-200'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[#5E3B00] font-medium text-sm sm:text-base mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={datosUsuario.email}
                        onChange={handleChange}
                        disabled={true} // Email no se puede cambiar
                        className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg bg-gray-50 border-gray-200"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[#5E3B00] font-medium text-sm sm:text-base mb-1">Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={datosUsuario.nombre}
                        onChange={handleChange}
                        disabled={!editando}
                        className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${
                          editando ? 'border-[#D3B178]' : 'bg-gray-50 border-gray-200'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[#5E3B00] font-medium text-sm sm:text-base mb-1">Apellido</label>
                      <input
                        type="text"
                        name="apellido"
                        value={datosUsuario.apellido}
                        onChange={handleChange}
                        disabled={!editando}
                        className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${
                          editando ? 'border-[#D3B178]' : 'bg-gray-50 border-gray-200'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[#5E3B00] font-medium text-sm sm:text-base mb-1">Teléfono</label>
                      <input
                        type="text"
                        name="telefono"
                        value={datosUsuario.telefono}
                        onChange={handleChange}
                        disabled={!editando}
                        className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${
                          editando ? 'border-[#D3B178]' : 'bg-gray-50 border-gray-200'
                        }`}
                      />
                    </div>
                    
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-[#5E3B00] font-medium text-sm sm:text-base mb-2">Dirección</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-[#5E3B00] text-xs sm:text-sm mb-1">Calle</label>
                          <input
                            type="text"
                            name="direccion.calle"
                            value={datosUsuario.direccion?.calle || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${
                              editando ? 'border-[#D3B178]' : 'bg-gray-50 border-gray-200'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[#5E3B00] text-xs sm:text-sm mb-1">Número</label>
                          <input
                            type="text"
                            name="direccion.numero"
                            value={datosUsuario.direccion?.numero || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${
                              editando ? 'border-[#D3B178]' : 'bg-gray-50 border-gray-200'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[#5E3B00] text-xs sm:text-sm mb-1">Piso</label>
                          <input
                            type="text"
                            name="direccion.piso"
                            value={datosUsuario.direccion?.piso || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${
                              editando ? 'border-[#D3B178]' : 'bg-gray-50 border-gray-200'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[#5E3B00] text-xs sm:text-sm mb-1">Departamento</label>
                          <input
                            type="text"
                            name="direccion.departamento"
                            value={datosUsuario.direccion?.departamento || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${
                              editando ? 'border-[#D3B178]' : 'bg-gray-50 border-gray-200'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[#5E3B00] text-xs sm:text-sm mb-1">Ciudad</label>
                          <input
                            type="text"
                            name="direccion.ciudad"
                            value={datosUsuario.direccion?.ciudad || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${
                              editando ? 'border-[#D3B178]' : 'bg-gray-50 border-gray-200'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[#5E3B00] text-xs sm:text-sm mb-1">Provincia</label>
                          <input
                            type="text"
                            name="direccion.provincia"
                            value={datosUsuario.direccion?.provincia || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${
                              editando ? 'border-[#D3B178]' : 'bg-gray-50 border-gray-200'
                            }`}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-[#5E3B00] text-xs sm:text-sm mb-1">Código Postal</label>
                          <input
                            type="text"
                            name="direccion.codigoPostal"
                            value={datosUsuario.direccion?.codigoPostal || ''}
                            onChange={handleChange}
                            disabled={!editando}
                            className={`w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg ${
                              editando ? 'border-[#D3B178]' : 'bg-gray-50 border-gray-200'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {editando && (
                    <div className="flex flex-wrap gap-4 mt-8">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-[#088714] text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                      >
                        {loading ? <FaSpinner className="animate-spin" /> : null}
                        Guardar cambios
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditando(false)}
                        disabled={loading}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}
            
            {/* Tab de Pedidos */}
            {activeTab === 'pedidos' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#5E3B00]">Historial de pedidos</h3>
                  
                  <button 
                    onClick={fetchPedidos} 
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-[#D3B178]/80 hover:bg-[#D3B178] text-[#3A2400] rounded transition-colors"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaHistory />}
                    <span>Actualizar</span>
                  </button>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#D3B178] border-r-transparent"></div>
                    <p className="mt-2 text-[#5E3B00]">Cargando pedidos...</p>
                  </div>
                ) : pedidos.length > 0 ? (
                  <div className="space-y-4">
                    {pedidos.map((pedido, index) => (
                      <PedidoItem key={pedido._id || pedido.pedidoId || index} pedido={pedido} />
                    ))}
                  </div>
                ) : (
                  <NoOrders />
                )}
              </div>
            )}
            
            {/* Tab de Seguridad */}
            {activeTab === 'seguridad' && (
              <div>
                <h3 className="text-xl font-bold text-[#5E3B00] mb-6">Cambiar contraseña</h3>
                
                <form onSubmit={handleCambioPassword} className="max-w-md">
                  <div className="mb-4">
                    <label className="block text-[#5E3B00] font-medium mb-1">Contraseña actual</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        name="passwordActual"
                        required
                        className="w-full p-3 border border-[#D3B178] rounded-lg pr-10"
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-[#815100] hover:text-[#5E3B00] focus:outline-none" 
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-[#5E3B00] font-medium mb-1">Nueva contraseña</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="passwordNuevo"
                        id="passwordNuevo"
                        required
                        className="w-full p-3 border border-[#D3B178] rounded-lg pr-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-[#815100] hover:text-[#5E3B00] focus:outline-none" 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    
                    {/* Requisitos de contraseña con validación dinámica */}
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mt-2">
                      <p className="font-medium mb-1">Requisitos de contraseña:</p>
                      <ul className="space-y-1">
                        <li className={`flex items-center ${newPassword.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                          <i className={`fas ${newPassword.length >= 8 ? 'fa-check' : 'fa-times'} mr-1`}></i>
                          Mínimo 8 caracteres
                        </li>
                        <li className={`flex items-center ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-red-600'}`}>
                          <i className={`fas ${/[A-Z]/.test(newPassword) ? 'fa-check' : 'fa-times'} mr-1`}></i>
                          Una letra mayúscula
                        </li>
                        <li className={`flex items-center ${/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-red-600'}`}>
                          <i className={`fas ${/[a-z]/.test(newPassword) ? 'fa-check' : 'fa-times'} mr-1`}></i>
                          Una letra minúscula
                        </li>
                        <li className={`flex items-center ${/\d/.test(newPassword) ? 'text-green-600' : 'text-red-600'}`}>
                          <i className={`fas ${/\d/.test(newPassword) ? 'fa-check' : 'fa-times'} mr-1`}></i>
                          Un número
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-[#5E3B00] font-medium mb-1">Confirmar contraseña</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="passwordConfirm"
                        required
                        className="w-full p-3 border border-[#D3B178] rounded-lg pr-10"
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-[#815100] hover:text-[#5E3B00] focus:outline-none" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-[#088714] text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : null}
                    Actualizar contraseña
                  </button>
                </form>
              </div>
            )}
            
            {/* Tab de Cuenta */}
            {activeTab === 'cuenta' && (
              <div>
                <h3 className="text-xl font-bold text-[#5E3B00] mb-6">Gestión de cuenta</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#5E3B00] mb-2">Cerrar sesión</h4>
                    <p className="text-[#815100] mb-3">
                      Cierra sesión en este dispositivo.
                    </p>
                    <button 
                      onClick={cerrarSesion}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2 bg-[#D3B178] text-[#3A2400] rounded-lg hover:bg-[#b39869] transition-colors"
                    >
                      <FaSignOutAlt />
                      Cerrar sesión
                    </button>
                  </div>
                  
                  <div className="border-t border-[#D3B178] pt-6">
                    <h4 className="font-semibold text-[#5E3B00] mb-2">Desactivar cuenta</h4>
                    <p className="text-[#815100] mb-3">
                      Tu cuenta será desactivada temporalmente y podrás reactivarla más tarde.
                    </p>
                    <button 
                      onClick={handleDesactivarCuenta}
                      disabled={loading}
                      className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : null}
                      Desactivar cuenta
                    </button>
                  </div>
                  
                  <div className="border-t border-[#D3B178] pt-6">
                    <h4 className="font-semibold text-red-600 mb-2">Zona de peligro</h4>
                    <p className="text-[#815100] mb-3">
                      Al eliminar tu cuenta, todos tus datos serán borrados permanentemente.
                    </p>
                    <button 
                      onClick={handleEliminarCuenta}
                      disabled={loading}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      {loading ? <FaSpinner className="animate-spin" /> : null}
                      Eliminar cuenta
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Perfil
