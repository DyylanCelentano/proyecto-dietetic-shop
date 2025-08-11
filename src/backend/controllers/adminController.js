import Producto from '../models/Producto.js'
import Usuario from '../models/Usuario.js'

// Middleware para verificar si es admin
const verificarAdmin = async (req, res, next) => {
    try {
        if (!req.usuario || req.usuario.rol !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren permisos de administrador.'
            })
        }
        next()
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al verificar permisos de administrador',
            error: error.message
        })
    }
}

// Estadísticas generales del dashboard
const obtenerEstadisticas = async (req, res) => {
    try {
        // Obtener fecha actual y del mes anterior
        const ahora = new Date()
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
        const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1)
        const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0)

        // Contar usuarios registrados
        const totalUsuarios = await Usuario.countDocuments()
        const usuariosEsteMes = await Usuario.countDocuments({
            createdAt: { $gte: inicioMes }
        })

        // Contar productos
        const totalProductos = await Producto.countDocuments()
        const productosStockBajo = await Producto.countDocuments({
            stock: { $lt: 10 }
        })

        // Simular datos de ventas (en un proyecto real, esto vendría de una colección de pedidos)
        const ventasHoy = Math.floor(Math.random() * 5000) + 1000
        const ventasMes = Math.floor(Math.random() * 50000) + 15000
        const productosVendidos = Math.floor(Math.random() * 100) + 20
        const pedidosPendientes = Math.floor(Math.random() * 10) + 1

        // Calcular tendencias
        const ventasMesAnterior = Math.floor(Math.random() * 45000) + 12000
        const tendenciaVentas = ventasMes > ventasMesAnterior ? 'up' : 'down'
        const porcentajeVentas = Math.abs(((ventasMes - ventasMesAnterior) / ventasMesAnterior) * 100).toFixed(1)

        res.json({
            success: true,
            data: {
                ventasHoy,
                ventasMes,
                productosVendidos,
                usuariosRegistrados: totalUsuarios,
                pedidosPendientes,
                stockBajo: productosStockBajo,
                tendencias: {
                    ventas: {
                        direccion: tendenciaVentas,
                        porcentaje: porcentajeVentas
                    },
                    usuarios: {
                        direccion: 'up',
                        porcentaje: '12.5'
                    }
                },
                resumen: {
                    totalProductos,
                    productosStockBajo,
                    usuariosEsteMes
                }
            }
        })

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        })
    }
}

// Obtener datos de ventas para gráficos
const obtenerDatosVentas = async (req, res) => {
    try {
        const { periodo = '7dias' } = req.query
        
        // Simular datos de ventas por período
        let datos = []
        
        if (periodo === '7dias') {
            datos = [
                { fecha: '2024-01-01', ventas: 1200 },
                { fecha: '2024-01-02', ventas: 1800 },
                { fecha: '2024-01-03', ventas: 1500 },
                { fecha: '2024-01-04', ventas: 2200 },
                { fecha: '2024-01-05', ventas: 1900 },
                { fecha: '2024-01-06', ventas: 2500 },
                { fecha: '2024-01-07', ventas: 2100 }
            ]
        } else if (periodo === '30dias') {
            // Generar datos para 30 días
            datos = Array.from({ length: 30 }, (_, i) => ({
                fecha: new Date(2024, 0, i + 1).toISOString().split('T')[0],
                ventas: Math.floor(Math.random() * 3000) + 1000
            }))
        }

        res.json({
            success: true,
            data: datos
        })

    } catch (error) {
        console.error('Error obteniendo datos de ventas:', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener datos de ventas',
            error: error.message
        })
    }
}

// Obtener productos más vendidos
const obtenerProductosMasVendidos = async (req, res) => {
    try {
        const productos = await Producto.find()
            .select('nombre precio stock categoria')
            .limit(10)
            .sort({ stock: -1 }) // Por ahora ordenamos por stock, en producción sería por ventas

        res.json({
            success: true,
            data: productos
        })

    } catch (error) {
        console.error('Error obteniendo productos más vendidos:', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos más vendidos',
            error: error.message
        })
    }
}

// Obtener alertas del sistema
const obtenerAlertas = async (req, res) => {
    try {
        const productosStockBajo = await Producto.find({ stock: { $lt: 10 } }).count()
        const totalProductos = await Producto.countDocuments()
        
        const alertas = []

        // Alerta de stock bajo
        if (productosStockBajo > 0) {
            alertas.push({
                id: 1,
                tipo: 'stock',
                titulo: 'Stock bajo en productos',
                descripcion: `${productosStockBajo} productos tienen stock bajo`,
                prioridad: productosStockBajo > 5 ? 'alta' : 'media',
                icono: '⚠️',
                accion: '/admin/productos?filtro=stock-bajo'
            })
        }

        // Alerta de productos agotados
        const productosAgotados = await Producto.find({ stock: 0 }).count()
        if (productosAgotados > 0) {
            alertas.push({
                id: 2,
                tipo: 'agotado',
                titulo: 'Productos agotados',
                descripcion: `${productosAgotados} productos están agotados`,
                prioridad: 'alta',
                icono: '🚫',
                accion: '/admin/productos?filtro=agotados'
            })
        }

        // Alerta de meta de ventas (simulada)
        alertas.push({
            id: 3,
            tipo: 'financiero',
            titulo: 'Meta de ventas',
            descripcion: 'Faltan $2,500 para alcanzar la meta mensual',
            prioridad: 'baja',
            icono: '💰',
            accion: '/admin/finanzas'
        })

        res.json({
            success: true,
            data: alertas
        })

    } catch (error) {
        console.error('Error obteniendo alertas:', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener alertas',
            error: error.message
        })
    }
}

// Obtener resumen de usuarios
const obtenerResumenUsuarios = async (req, res) => {
    try {
        const totalUsuarios = await Usuario.countDocuments()
        const usuariosEsteMes = await Usuario.countDocuments({
            createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        })
        const usuariosSemana = await Usuario.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })

        res.json({
            success: true,
            data: {
                total: totalUsuarios,
                esteMes: usuariosEsteMes,
                estaSemana: usuariosSemana,
                tendencia: 'up',
                porcentaje: '15.3'
            }
        })

    } catch (error) {
        console.error('Error obteniendo resumen de usuarios:', error)
        res.status(500).json({
            success: false,
            message: 'Error al obtener resumen de usuarios',
            error: error.message
        })
    }
}

export {
    obtenerAlertas, obtenerDatosVentas, obtenerEstadisticas, obtenerProductosMasVendidos, obtenerResumenUsuarios, verificarAdmin
}

