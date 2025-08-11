import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useToast } from '../../contexts/ToastContext'
import useAdmin from '../../hooks/useAdmin'
import { useAuth } from '../../hooks/useAuth'

const AdminUsuarios = () => {
    const { usuario, estaAutenticado, esAdmin } = useAuth()
    const { loading, error } = useAdmin()
    const { mostrarExito, mostrarError } = useToast()
    
    const [usuarios, setUsuarios] = useState([])
    const [cargandoUsuarios, setCargandoUsuarios] = useState(true)
    const [filtros, setFiltros] = useState({
        busqueda: '',
        rol: 'todos',
        estado: 'todos'
    })
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
    const [mostrarDetalles, setMostrarDetalles] = useState(false)
    const [paginaActual, setPaginaActual] = useState(1)
    const usuariosPorPagina = 10

    // Estados y roles
    const roles = [
        { value: 'usuario', label: 'Usuario', color: 'bg-blue-100 text-blue-800' },
        { value: 'admin', label: 'Administrador', color: 'bg-purple-100 text-purple-800' }
    ]

    const estados = [
        { value: 'activo', label: 'Activo', color: 'bg-green-100 text-green-800' },
        { value: 'inactivo', label: 'Inactivo', color: 'bg-red-100 text-red-800' },
        { value: 'suspendido', label: 'Suspendido', color: 'bg-yellow-100 text-yellow-800' }
    ]

    // Cargar usuarios simulados
    const cargarUsuarios = async () => {
        try {
            setCargandoUsuarios(true)
            
            // Datos simulados - en producción usar API real
            const usuariosSimulados = [
                {
                    _id: '1',
                    nombre: 'Juan Pérez',
                    email: 'juan@email.com',
                    telefono: '+54 9 11 1234-5678',
                    rol: 'usuario',
                    estado: 'activo',
                    fechaRegistro: '2024-09-15T10:30:00Z',
                    ultimoAcceso: '2024-10-15T14:20:00Z',
                    pedidosRealizados: 8,
                    totalGastado: 24500,
                    direccion: {
                        calle: 'Av. Corrientes 1234',
                        ciudad: 'Buenos Aires',
                        provincia: 'CABA',
                        codigoPostal: '1043'
                    }
                },
                {
                    _id: '2',
                    nombre: 'María González',
                    email: 'maria@email.com',
                    telefono: '+54 9 11 8765-4321',
                    rol: 'usuario',
                    estado: 'activo',
                    fechaRegistro: '2024-08-22T15:45:00Z',
                    ultimoAcceso: '2024-10-14T09:15:00Z',
                    pedidosRealizados: 12,
                    totalGastado: 35200,
                    direccion: {
                        calle: 'San Martín 567',
                        ciudad: 'La Plata',
                        provincia: 'Buenos Aires',
                        codigoPostal: '1900'
                    }
                },
                {
                    _id: '3',
                    nombre: 'Carlos Rodríguez',
                    email: 'carlos@email.com',
                    telefono: '+54 9 11 5555-1234',
                    rol: 'admin',
                    estado: 'activo',
                    fechaRegistro: '2024-06-10T12:00:00Z',
                    ultimoAcceso: '2024-10-15T16:30:00Z',
                    pedidosRealizados: 0,
                    totalGastado: 0,
                    direccion: {
                        calle: 'Rivadavia 890',
                        ciudad: 'Córdoba',
                        provincia: 'Córdoba',
                        codigoPostal: '5000'
                    }
                },
                {
                    _id: '4',
                    nombre: 'Ana López',
                    email: 'ana@email.com',
                    telefono: '+54 9 11 9999-8888',
                    rol: 'usuario',
                    estado: 'activo',
                    fechaRegistro: '2024-10-01T08:20:00Z',
                    ultimoAcceso: '2024-10-12T11:45:00Z',
                    pedidosRealizados: 3,
                    totalGastado: 8900,
                    direccion: {
                        calle: 'Belgrano 345',
                        ciudad: 'Rosario',
                        provincia: 'Santa Fe',
                        codigoPostal: '2000'
                    }
                },
                {
                    _id: '5',
                    nombre: 'Luis Martínez',
                    email: 'luis@email.com',
                    telefono: '+54 9 11 7777-5555',
                    rol: 'usuario',
                    estado: 'inactivo',
                    fechaRegistro: '2024-07-18T14:30:00Z',
                    ultimoAcceso: '2024-09-20T10:15:00Z',
                    pedidosRealizados: 2,
                    totalGastado: 3400,
                    direccion: {
                        calle: 'Mitre 123',
                        ciudad: 'Mendoza',
                        provincia: 'Mendoza',
                        codigoPostal: '5500'
                    }
                }
            ]

            setUsuarios(usuariosSimulados)
        } catch (error) {
            console.error('Error cargando usuarios:', error)
            mostrarError('Error al cargar usuarios')
        } finally {
            setCargandoUsuarios(false)
        }
    }

    useEffect(() => {
        if (esAdmin) {
            cargarUsuarios()
        }
    }, [esAdmin])

    // Filtrar usuarios
    const usuariosFiltrados = usuarios.filter(usuario => {
        const coincideRol = filtros.rol === 'todos' || usuario.rol === filtros.rol
        const coincideEstado = filtros.estado === 'todos' || usuario.estado === filtros.estado
        const coincideBusqueda = !filtros.busqueda || 
            usuario.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            usuario.email.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
            usuario.telefono.includes(filtros.busqueda)
        
        return coincideRol && coincideEstado && coincideBusqueda
    })

    // Paginación
    const indiceInicio = (paginaActual - 1) * usuariosPorPagina
    const indiceFin = indiceInicio + usuariosPorPagina
    const usuariosEnPagina = usuariosFiltrados.slice(indiceInicio, indiceFin)
    const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina)

    // Cambiar estado de usuario
    const cambiarEstadoUsuario = async (usuarioId, nuevoEstado) => {
        try {
            // En producción: await axios.put(`/api/admin/usuarios/${usuarioId}/estado`, { estado: nuevoEstado })
            
            setUsuarios(prev => prev.map(user => 
                user._id === usuarioId 
                    ? { ...user, estado: nuevoEstado }
                    : user
            ))
            
            mostrarExito(`Estado del usuario actualizado a ${nuevoEstado}`)
        } catch (error) {
            console.error('Error actualizando estado:', error)
            mostrarError('Error al actualizar estado del usuario')
        }
    }

    // Cambiar rol de usuario
    const cambiarRolUsuario = async (usuarioId, nuevoRol) => {
        try {
            // En producción: await axios.put(`/api/admin/usuarios/${usuarioId}/rol`, { rol: nuevoRol })
            
            setUsuarios(prev => prev.map(user => 
                user._id === usuarioId 
                    ? { ...user, rol: nuevoRol }
                    : user
            ))
            
            mostrarExito(`Rol del usuario actualizado a ${nuevoRol}`)
        } catch (error) {
            console.error('Error actualizando rol:', error)
            mostrarError('Error al actualizar rol del usuario')
        }
    }

    // Ver detalles del usuario
    const verDetalles = (usuario) => {
        setUsuarioSeleccionado(usuario)
        setMostrarDetalles(true)
    }

    // Obtener configuración del rol
    const obtenerConfigRol = (rol) => {
        return roles.find(r => r.value === rol) || roles[0]
    }

    // Obtener configuración del estado
    const obtenerConfigEstado = (estado) => {
        return estados.find(e => e.value === estado) || estados[0]
    }

    // Formatear fecha
    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    // Estadísticas rápidas
    const estadisticas = {
        totalUsuarios: usuarios.length,
        usuariosActivos: usuarios.filter(u => u.estado === 'activo').length,
        administradores: usuarios.filter(u => u.rol === 'admin').length,
        nuevosEstesMes: usuarios.filter(u => {
            const fechaRegistro = new Date(u.fechaRegistro)
            const ahora = new Date()
            return fechaRegistro.getMonth() === ahora.getMonth() && 
                   fechaRegistro.getFullYear() === ahora.getFullYear()
        }).length
    }

    if (!estaAutenticado || !esAdmin) {
        return (
            <div className="min-h-screen bg-[#FFF8ED] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-['Epilogue'] text-[#3A2400] mb-4">
                        Acceso Denegado
                    </h2>
                    <p className="text-[#4D3000]">
                        No tienes permisos para acceder a esta sección.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <AdminLayout>
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-['Epilogue'] font-bold text-[#3A2400] mb-2">
                            Gestión de Usuarios
                        </h1>
                        <p className="text-[#4D3000] font-['Gabarito']">
                            Administra usuarios y permisos del sistema
                        </p>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178]">
                        <div className="flex items-center">
                            <div className="text-3xl mb-2">👥</div>
                            <div className="ml-4">
                                <div className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                                    {estadisticas.totalUsuarios}
                                </div>
                                <div className="text-sm text-[#4D3000] font-['Gabarito']">
                                    Total Usuarios
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178]">
                        <div className="flex items-center">
                            <div className="text-3xl mb-2">✅</div>
                            <div className="ml-4">
                                <div className="text-2xl font-['Epilogue'] font-bold text-green-600">
                                    {estadisticas.usuariosActivos}
                                </div>
                                <div className="text-sm text-[#4D3000] font-['Gabarito']">
                                    Usuarios Activos
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178]">
                        <div className="flex items-center">
                            <div className="text-3xl mb-2">👑</div>
                            <div className="ml-4">
                                <div className="text-2xl font-['Epilogue'] font-bold text-purple-600">
                                    {estadisticas.administradores}
                                </div>
                                <div className="text-sm text-[#4D3000] font-['Gabarito']">
                                    Administradores
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178]">
                        <div className="flex items-center">
                            <div className="text-3xl mb-2">🆕</div>
                            <div className="ml-4">
                                <div className="text-2xl font-['Epilogue'] font-bold text-blue-600">
                                    {estadisticas.nuevosEstesMes}
                                </div>
                                <div className="text-sm text-[#4D3000] font-['Gabarito']">
                                    Nuevos este mes
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178] mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Búsqueda */}
                        <div>
                            <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                                Buscar usuario
                            </label>
                            <input
                                type="text"
                                value={filtros.busqueda}
                                onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                                placeholder="Nombre, email o teléfono..."
                                className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                            />
                        </div>

                        {/* Rol */}
                        <div>
                            <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                                Rol
                            </label>
                            <select
                                value={filtros.rol}
                                onChange={(e) => setFiltros({...filtros, rol: e.target.value})}
                                className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                            >
                                <option value="todos">Todos los roles</option>
                                {roles.map(rol => (
                                    <option key={rol.value} value={rol.value}>
                                        {rol.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Estado */}
                        <div>
                            <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                                Estado
                            </label>
                            <select
                                value={filtros.estado}
                                onChange={(e) => setFiltros({...filtros, estado: e.target.value})}
                                className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                            >
                                <option value="todos">Todos los estados</option>
                                {estados.map(estado => (
                                    <option key={estado.value} value={estado.value}>
                                        {estado.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tabla de usuarios */}
                <div className="bg-white rounded-lg shadow-md border border-[#D3B178] overflow-hidden">
                    {cargandoUsuarios ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#815100] mx-auto"></div>
                            <p className="mt-4 text-[#4D3000] font-['Gabarito']">Cargando usuarios...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#FFF1D9]">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Usuario
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Contacto
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Rol
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Actividad
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-['Gabarito'] font-semibold text-[#3A2400] uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-[#D3B178]">
                                        {usuariosEnPagina.map((usuario) => {
                                            const configRol = obtenerConfigRol(usuario.rol)
                                            const configEstado = obtenerConfigEstado(usuario.estado)
                                            return (
                                                <tr key={usuario._id} className="hover:bg-[#FFF8ED] transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 rounded-full bg-[#D3B178] flex items-center justify-center">
                                                                <span className="text-[#3A2400] font-['Gabarito'] font-semibold">
                                                                    {usuario.nombre.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-['Gabarito'] font-medium text-[#3A2400]">
                                                                    {usuario.nombre}
                                                                </div>
                                                                <div className="text-sm text-[#4D3000]">
                                                                    Registro: {formatearFecha(usuario.fechaRegistro)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-['Gabarito'] text-[#3A2400]">
                                                            {usuario.email}
                                                        </div>
                                                        <div className="text-sm text-[#4D3000]">
                                                            {usuario.telefono}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-['Gabarito'] ${configRol.color}`}>
                                                            {configRol.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-['Gabarito'] ${configEstado.color}`}>
                                                            {configEstado.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-['Gabarito']">
                                                        <div className="text-[#3A2400]">
                                                            {usuario.pedidosRealizados} pedidos
                                                        </div>
                                                        <div className="text-[#4D3000]">
                                                            ${usuario.totalGastado.toLocaleString('es-AR')}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => verDetalles(usuario)}
                                                                className="text-[#815100] hover:text-[#5E3B00] transition-colors"
                                                                title="Ver detalles"
                                                            >
                                                                👁️
                                                            </button>
                                                            
                                                            {/* Cambiar estado */}
                                                            {usuario._id !== usuario._id && ( // No permitir cambiar el propio estado
                                                                <select
                                                                    value={usuario.estado}
                                                                    onChange={(e) => cambiarEstadoUsuario(usuario._id, e.target.value)}
                                                                    className="text-xs px-2 py-1 border border-[#D3B178] rounded font-['Gabarito']"
                                                                >
                                                                    {estados.map(estado => (
                                                                        <option key={estado.value} value={estado.value}>
                                                                            {estado.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            )}
                                                            
                                                            {/* Cambiar rol */}
                                                            {usuario._id !== usuario._id && ( // No permitir cambiar el propio rol
                                                                <select
                                                                    value={usuario.rol}
                                                                    onChange={(e) => cambiarRolUsuario(usuario._id, e.target.value)}
                                                                    className="text-xs px-2 py-1 border border-[#D3B178] rounded font-['Gabarito']"
                                                                >
                                                                    {roles.map(rol => (
                                                                        <option key={rol.value} value={rol.value}>
                                                                            {rol.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {totalPaginas > 1 && (
                                <div className="bg-[#FFF1D9] px-6 py-3 flex items-center justify-between">
                                    <div className="text-sm text-[#4D3000] font-['Gabarito']">
                                        Mostrando {indiceInicio + 1} a {Math.min(indiceFin, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                                            disabled={paginaActual === 1}
                                            className="px-3 py-1 rounded bg-white border border-[#D3B178] text-[#3A2400] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF8ED] transition-colors"
                                        >
                                            Anterior
                                        </button>
                                        <span className="px-3 py-1 text-[#3A2400] font-['Gabarito']">
                                            {paginaActual} de {totalPaginas}
                                        </span>
                                        <button
                                            onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                                            disabled={paginaActual === totalPaginas}
                                            className="px-3 py-1 rounded bg-white border border-[#D3B178] text-[#3A2400] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFF8ED] transition-colors"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Modal de detalles */}
                {mostrarDetalles && usuarioSeleccionado && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                                        Detalles del Usuario
                                    </h2>
                                    <button
                                        onClick={() => setMostrarDetalles(false)}
                                        className="text-[#4D3000] hover:text-[#3A2400] text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Información personal */}
                                    <div className="bg-[#FFF8ED] p-4 rounded-lg">
                                        <h3 className="font-['Epilogue'] font-semibold text-[#3A2400] mb-3">
                                            Información Personal
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-['Gabarito']">
                                            <div>
                                                <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre}</p>
                                                <p><strong>Email:</strong> {usuarioSeleccionado.email}</p>
                                                <p><strong>Teléfono:</strong> {usuarioSeleccionado.telefono}</p>
                                            </div>
                                            <div>
                                                <p><strong>Rol:</strong> {obtenerConfigRol(usuarioSeleccionado.rol).label}</p>
                                                <p><strong>Estado:</strong> {obtenerConfigEstado(usuarioSeleccionado.estado).label}</p>
                                                <p><strong>Registro:</strong> {formatearFecha(usuarioSeleccionado.fechaRegistro)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dirección */}
                                    <div className="bg-[#FFF8ED] p-4 rounded-lg">
                                        <h3 className="font-['Epilogue'] font-semibold text-[#3A2400] mb-3">
                                            Dirección
                                        </h3>
                                        <div className="text-sm font-['Gabarito']">
                                            <p>{usuarioSeleccionado.direccion.calle}</p>
                                            <p>{usuarioSeleccionado.direccion.ciudad}, {usuarioSeleccionado.direccion.provincia}</p>
                                            <p>CP: {usuarioSeleccionado.direccion.codigoPostal}</p>
                                        </div>
                                    </div>

                                    {/* Estadísticas de compra */}
                                    <div className="bg-[#FFF8ED] p-4 rounded-lg">
                                        <h3 className="font-['Epilogue'] font-semibold text-[#3A2400] mb-3">
                                            Estadísticas de Compra
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm font-['Gabarito']">
                                            <div className="text-center">
                                                <div className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                                                    {usuarioSeleccionado.pedidosRealizados}
                                                </div>
                                                <div className="text-[#4D3000]">Pedidos Realizados</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-['Epilogue'] font-bold text-[#3A2400]">
                                                    ${usuarioSeleccionado.totalGastado.toLocaleString('es-AR')}
                                                </div>
                                                <div className="text-[#4D3000]">Total Gastado</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actividad reciente */}
                                    <div className="bg-[#FFF8ED] p-4 rounded-lg">
                                        <h3 className="font-['Epilogue'] font-semibold text-[#3A2400] mb-3">
                                            Actividad Reciente
                                        </h3>
                                        <div className="text-sm font-['Gabarito']">
                                            <p><strong>Último acceso:</strong> {formatearFecha(usuarioSeleccionado.ultimoAcceso)}</p>
                                            {usuarioSeleccionado.pedidosRealizados > 0 && (
                                                <p className="mt-2">
                                                    <strong>Promedio por pedido:</strong> ${Math.round(usuarioSeleccionado.totalGastado / usuarioSeleccionado.pedidosRealizados).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

export default AdminUsuarios
