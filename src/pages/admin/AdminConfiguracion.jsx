import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { ChartIcon, ClipboardIcon, PackageIcon, SettingsIcon, UsersIcon } from '../../components/icons/Icons'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../hooks/useAuth'

const AdminConfiguracion = () => {
    const { usuario, estaAutenticado, esAdmin } = useAuth()
    const { mostrarExito, mostrarError } = useToast()
    
    const [configuraciones, setConfiguraciones] = useState({
        general: {
            nombreTienda: 'Dietética Natural',
            email: 'info@dieteticanatural.com',
            telefono: '+54 9 11 1234-5678',
            direccion: 'Av. Corrientes 1234, CABA',
            descripcion: 'Tu tienda de productos naturales y orgánicos',
            moneda: 'ARS',
            idioma: 'es'
        },
        envios: {
            costoEnvio: 1500,
            envioGratisDesde: 15000,
            tiempoEntrega: '2-5 días hábiles',
            zonasEnvio: ['CABA', 'GBA', 'Interior'],
            metodosPago: ['Efectivo', 'Tarjeta de Crédito', 'Transferencia', 'MercadoPago']
        },
        inventario: {
            alertaStockBajo: 10,
            permitirVentaSinStock: false,
            mostrarStock: true,
            unidadMedidaPorDefecto: 'unidad'
        },
        notificaciones: {
            emailNuevoPedido: true,
            emailStockBajo: true,
            emailNuevoUsuario: false,
            smsNuevoPedido: false
        },
        seguridad: {
            requiere2FA: false,
            sesionExpira: 24,
            intentosLoginMax: 5,
            logActividad: true
        },
        seo: {
            metaTitle: 'Dietética Natural - Productos Orgánicos',
            metaDescription: 'Encuentra los mejores productos naturales y orgánicos para tu bienestar',
            keywords: 'dietética, productos naturales, orgánicos, frutos secos',
            googleAnalytics: '',
            facebookPixel: ''
        }
    })

    const [seccionActiva, setSeccionActiva] = useState('general')
    const [guardando, setGuardando] = useState(false)

    // Secciones de configuración
    const secciones = [
        { id: 'general', nombre: 'General', icono: <SettingsIcon className="w-4 h-4 text-brand-primary" /> },
        { id: 'envios', nombre: 'Envíos y Pagos', icono: <PackageIcon className="w-4 h-4 text-brand-primary" /> },
        { id: 'inventario', nombre: 'Inventario', icono: <ClipboardIcon className="w-4 h-4 text-brand-primary" /> },
        { id: 'notificaciones', nombre: 'Notificaciones', icono: <UsersIcon className="w-4 h-4 text-brand-primary" /> },
        { id: 'seguridad', nombre: 'Seguridad', icono: <SettingsIcon className="w-4 h-4 text-brand-primary" /> },
        { id: 'seo', nombre: 'SEO y Marketing', icono: <ChartIcon className="w-4 h-4 text-brand-primary" /> }
    ]

    // Cargar configuraciones
    const cargarConfiguraciones = async () => {
        try {
            // En producción: const response = await axios.get('/api/admin/configuraciones')
            // setConfiguraciones(response.data)
            
            // Por ahora usamos datos por defecto
            console.log('Configuraciones cargadas')
        } catch (error) {
            console.error('Error cargando configuraciones:', error)
            mostrarError('Error al cargar configuraciones')
        }
    }

    useEffect(() => {
        if (esAdmin) {
            cargarConfiguraciones()
        }
    }, [esAdmin])

    // Actualizar configuración
    const actualizarConfiguracion = (seccion, campo, valor) => {
        setConfiguraciones(prev => ({
            ...prev,
            [seccion]: {
                ...prev[seccion],
                [campo]: valor
            }
        }))
    }

    // Guardar configuraciones
    const guardarConfiguraciones = async () => {
        try {
            setGuardando(true)
            
            // En producción: await axios.put('/api/admin/configuraciones', configuraciones)
            
            // Simular guardado
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            mostrarExito('Configuraciones guardadas correctamente')
        } catch (error) {
            console.error('Error guardando configuraciones:', error)
            mostrarError('Error al guardar configuraciones')
        } finally {
            setGuardando(false)
        }
    }

    // Renderizar sección general
    const renderGeneral = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                Información General
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                        Nombre de la tienda
                    </label>
                    <input
                        type="text"
                        value={configuraciones.general.nombreTienda}
                        onChange={(e) => actualizarConfiguracion('general', 'nombreTienda', e.target.value)}
                        className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                        Email de contacto
                    </label>
                    <input
                        type="email"
                        value={configuraciones.general.email}
                        onChange={(e) => actualizarConfiguracion('general', 'email', e.target.value)}
                        className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                        Teléfono
                    </label>
                    <input
                        type="tel"
                        value={configuraciones.general.telefono}
                        onChange={(e) => actualizarConfiguracion('general', 'telefono', e.target.value)}
                        className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                        Moneda
                    </label>
                    <select
                        value={configuraciones.general.moneda}
                        onChange={(e) => actualizarConfiguracion('general', 'moneda', e.target.value)}
                        className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                    >
                        <option value="ARS">Peso Argentino (ARS)</option>
                        <option value="USD">Dólar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                    Dirección
                </label>
                <input
                    type="text"
                    value={configuraciones.general.direccion}
                    onChange={(e) => actualizarConfiguracion('general', 'direccion', e.target.value)}
                    className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                    Descripción de la tienda
                </label>
                <textarea
                    value={configuraciones.general.descripcion}
                    onChange={(e) => actualizarConfiguracion('general', 'descripcion', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                />
            </div>
        </div>
    )

    // Renderizar sección envíos
    const renderEnvios = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                Configuración de Envíos y Pagos
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                        Costo de envío ($)
                    </label>
                    <input
                        type="number"
                        value={configuraciones.envios.costoEnvio}
                        onChange={(e) => actualizarConfiguracion('envios', 'costoEnvio', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                        Envío gratis desde ($)
                    </label>
                    <input
                        type="number"
                        value={configuraciones.envios.envioGratisDesde}
                        onChange={(e) => actualizarConfiguracion('envios', 'envioGratisDesde', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                    />
                </div>
            </div>

            <div>
                <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                    Tiempo de entrega
                </label>
                <input
                    type="text"
                    value={configuraciones.envios.tiempoEntrega}
                    onChange={(e) => actualizarConfiguracion('envios', 'tiempoEntrega', e.target.value)}
                    className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                    Métodos de pago aceptados
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {['Efectivo', 'Tarjeta de Crédito', 'Transferencia', 'MercadoPago', 'Cripto'].map(metodo => (
                        <label key={metodo} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={configuraciones.envios.metodosPago.includes(metodo)}
                                onChange={(e) => {
                                    const metodos = e.target.checked
                                        ? [...configuraciones.envios.metodosPago, metodo]
                                        : configuraciones.envios.metodosPago.filter(m => m !== metodo)
                                    actualizarConfiguracion('envios', 'metodosPago', metodos)
                                }}
                                className="mr-2"
                            />
                            <span className="text-[#3A2400] font-['Gabarito']">{metodo}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )

    // Renderizar sección inventario
    const renderInventario = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                Gestión de Inventario
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                        Alerta de stock bajo (unidades)
                    </label>
                    <input
                        type="number"
                        value={configuraciones.inventario.alertaStockBajo}
                        onChange={(e) => actualizarConfiguracion('inventario', 'alertaStockBajo', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                        Unidad de medida por defecto
                    </label>
                    <select
                        value={configuraciones.inventario.unidadMedidaPorDefecto}
                        onChange={(e) => actualizarConfiguracion('inventario', 'unidadMedidaPorDefecto', e.target.value)}
                        className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                    >
                        <option value="unidad">Unidad</option>
                        <option value="kg">Kilogramo</option>
                        <option value="g">Gramo</option>
                        <option value="l">Litro</option>
                        <option value="ml">Mililitro</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={configuraciones.inventario.permitirVentaSinStock}
                        onChange={(e) => actualizarConfiguracion('inventario', 'permitirVentaSinStock', e.target.checked)}
                        className="mr-3"
                    />
                    <span className="text-[#3A2400] font-['Gabarito']">
                        Permitir ventas sin stock disponible
                    </span>
                </label>

                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={configuraciones.inventario.mostrarStock}
                        onChange={(e) => actualizarConfiguracion('inventario', 'mostrarStock', e.target.checked)}
                        className="mr-3"
                    />
                    <span className="text-[#3A2400] font-['Gabarito']">
                        Mostrar cantidad en stock a los clientes
                    </span>
                </label>
            </div>
        </div>
    )

    // Renderizar sección notificaciones
    const renderNotificaciones = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                Configuración de Notificaciones
            </h3>
            
            <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-[#FFF8ED] rounded-lg">
                    <span className="text-[#3A2400] font-['Gabarito']">
                        Email para nuevos pedidos
                    </span>
                    <input
                        type="checkbox"
                        checked={configuraciones.notificaciones.emailNuevoPedido}
                        onChange={(e) => actualizarConfiguracion('notificaciones', 'emailNuevoPedido', e.target.checked)}
                        className="toggle"
                    />
                </label>

                <label className="flex items-center justify-between p-4 bg-[#FFF8ED] rounded-lg">
                    <span className="text-[#3A2400] font-['Gabarito']">
                        Email para stock bajo
                    </span>
                    <input
                        type="checkbox"
                        checked={configuraciones.notificaciones.emailStockBajo}
                        onChange={(e) => actualizarConfiguracion('notificaciones', 'emailStockBajo', e.target.checked)}
                        className="toggle"
                    />
                </label>

                <label className="flex items-center justify-between p-4 bg-[#FFF8ED] rounded-lg">
                    <span className="text-[#3A2400] font-['Gabarito']">
                        Email para nuevos usuarios
                    </span>
                    <input
                        type="checkbox"
                        checked={configuraciones.notificaciones.emailNuevoUsuario}
                        onChange={(e) => actualizarConfiguracion('notificaciones', 'emailNuevoUsuario', e.target.checked)}
                        className="toggle"
                    />
                </label>

                <label className="flex items-center justify-between p-4 bg-[#FFF8ED] rounded-lg">
                    <span className="text-[#3A2400] font-['Gabarito']">
                        SMS para nuevos pedidos
                    </span>
                    <input
                        type="checkbox"
                        checked={configuraciones.notificaciones.smsNuevoPedido}
                        onChange={(e) => actualizarConfiguracion('notificaciones', 'smsNuevoPedido', e.target.checked)}
                        className="toggle"
                    />
                </label>
            </div>
        </div>
    )

    // Renderizar sección seguridad
    const renderSeguridad = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                Configuración de Seguridad
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                        Sesión expira en (horas)
                    </label>
                    <input
                        type="number"
                        value={configuraciones.seguridad.sesionExpira}
                        onChange={(e) => actualizarConfiguracion('seguridad', 'sesionExpira', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                        Máximo intentos de login
                    </label>
                    <input
                        type="number"
                        value={configuraciones.seguridad.intentosLoginMax}
                        onChange={(e) => actualizarConfiguracion('seguridad', 'intentosLoginMax', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-[#FFF8ED] rounded-lg">
                    <span className="text-[#3A2400] font-['Gabarito']">
                        Requerir autenticación de dos factores (2FA)
                    </span>
                    <input
                        type="checkbox"
                        checked={configuraciones.seguridad.requiere2FA}
                        onChange={(e) => actualizarConfiguracion('seguridad', 'requiere2FA', e.target.checked)}
                        className="toggle"
                    />
                </label>

                <label className="flex items-center justify-between p-4 bg-[#FFF8ED] rounded-lg">
                    <span className="text-[#3A2400] font-['Gabarito']">
                        Registrar actividad de usuarios
                    </span>
                    <input
                        type="checkbox"
                        checked={configuraciones.seguridad.logActividad}
                        onChange={(e) => actualizarConfiguracion('seguridad', 'logActividad', e.target.checked)}
                        className="toggle"
                    />
                </label>
            </div>
        </div>
    )

    // Renderizar sección SEO
    const renderSEO = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                SEO y Marketing
            </h3>
            
            <div>
                <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                    Meta Title
                </label>
                <input
                    type="text"
                    value={configuraciones.seo.metaTitle}
                    onChange={(e) => actualizarConfiguracion('seo', 'metaTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                    Meta Description
                </label>
                <textarea
                    value={configuraciones.seo.metaDescription}
                    onChange={(e) => actualizarConfiguracion('seo', 'metaDescription', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                />
            </div>

            <div>
                <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                    Keywords (separadas por comas)
                </label>
                <input
                    type="text"
                    value={configuraciones.seo.keywords}
                    onChange={(e) => actualizarConfiguracion('seo', 'keywords', e.target.value)}
                    className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                        Google Analytics ID
                    </label>
                    <input
                        type="text"
                        value={configuraciones.seo.googleAnalytics}
                        onChange={(e) => actualizarConfiguracion('seo', 'googleAnalytics', e.target.value)}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-[#3A2400] font-['Gabarito'] font-medium mb-2">
                        Facebook Pixel ID
                    </label>
                    <input
                        type="text"
                        value={configuraciones.seo.facebookPixel}
                        onChange={(e) => actualizarConfiguracion('seo', 'facebookPixel', e.target.value)}
                        placeholder="123456789012345"
                        className="w-full px-4 py-2 border border-[#D3B178] rounded-lg focus:ring-2 focus:ring-[#815100] focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    )

    // Renderizar contenido según sección activa
    const renderContenido = () => {
        switch (seccionActiva) {
            case 'general': return renderGeneral()
            case 'envios': return renderEnvios()
            case 'inventario': return renderInventario()
            case 'notificaciones': return renderNotificaciones()
            case 'seguridad': return renderSeguridad()
            case 'seo': return renderSEO()
            default: return renderGeneral()
        }
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
            <div className="p-6 bg-white">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-['Epilogue'] font-bold text-[#3A2400] mb-2">
                            Configuración del Sistema
                        </h1>
                        <p className="text-[#4D3000] font-['Gabarito']">
                            Configura los parámetros generales de tu tienda
                        </p>
                    </div>
                    
                    <button
                        onClick={guardarConfiguraciones}
                        disabled={guardando}
                        className="bg-[#815100] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-['Gabarito'] font-medium hover:bg-[#5E3B00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        {guardando ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 bg-[#FFF8ED] rounded-lg shadow-md border border-[#D3B178] h-fit">
                        <div className="p-4">
                            <h3 className="font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                                Secciones
                            </h3>
                            <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:space-y-2">
                                {secciones.map(seccion => (
                                    <button
                                        key={seccion.id}
                                        onClick={() => setSeccionActiva(seccion.id)}
                                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-['Gabarito'] transition-colors text-sm sm:text-base ${
                                            seccionActiva === seccion.id
                                                ? 'bg-[#FFF1D9] text-[#3A2400] border border-[#D3B178]'
                                                : 'text-[#4D3000] hover:bg-[#FFF8ED]'
                                        }`}
                                    >
                                        <span className="mr-2 sm:mr-3">{seccion.icono}</span>
                                        {seccion.nombre}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="flex-1 bg-[#FFF8ED] rounded-lg shadow-md border border-[#D3B178] p-4 sm:p-6">
                        {renderContenido()}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AdminConfiguracion
