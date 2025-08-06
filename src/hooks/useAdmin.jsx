import { useCallback, useState } from 'react';
import { useAuth } from './useAuth';

const useAdmin = () => {
    const { usuario, estaAutenticado, esAdmin } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Simular peticiones a la API de admin con datos de prueba
    const simularRequest = useCallback(async (data, delay = 500) => {
        try {
            setLoading(true);
            setError(null);

            // Simular tiempo de respuesta
            await new Promise(resolve => setTimeout(resolve, delay));

            return { data, success: true };
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener estadísticas del dashboard
    const obtenerEstadisticas = useCallback(async () => {
        const statsData = {
            ventasHoy: 45600,
            ventasMes: 342500,
            productosVendidos: 156,
            usuariosRegistrados: 89,
            pedidosPendientes: 12,
            stockBajo: 5
        };
        return await simularRequest(statsData);
    }, [simularRequest]);

    // Obtener datos de ventas
    const obtenerDatosVentas = useCallback(async (periodo = '7dias') => {
        const ventasData = [
            { fecha: '2025-07-30', ventas: 12500, pedidos: 8, productos: 23 },
            { fecha: '2025-07-31', ventas: 18900, pedidos: 12, productos: 34 },
            { fecha: '2025-08-01', ventas: 22300, pedidos: 15, productos: 42 },
            { fecha: '2025-08-02', ventas: 16700, pedidos: 10, productos: 28 },
            { fecha: '2025-08-03', ventas: 31200, pedidos: 18, productos: 51 },
            { fecha: '2025-08-04', ventas: 28800, pedidos: 16, productos: 47 },
            { fecha: '2025-08-05', ventas: 35400, pedidos: 21, productos: 58 }
        ];
        return await simularRequest(ventasData);
    }, [simularRequest]);

    // Obtener productos más vendidos
    const obtenerProductosMasVendidos = useCallback(async () => {
        const productosData = [
            { nombre: 'Almendras Premium', ventas: 89, stock: 156 },
            { nombre: 'Granola Orgánica', ventas: 76, stock: 203 },
            { nombre: 'Nueces Peladas', ventas: 65, stock: 98 },
            { nombre: 'Mix Frutos Secos', ventas: 54, stock: 87 },
            { nombre: 'Semillas de Chía', ventas: 43, stock: 124 }
        ];
        return await simularRequest(productosData);
    }, [simularRequest]);

    // Obtener alertas
    const obtenerAlertas = useCallback(async () => {
        const alertasData = [
            { tipo: 'stock', mensaje: '5 productos con stock bajo', urgencia: 'alta' },
            { tipo: 'pedidos', mensaje: '12 pedidos pendientes de procesar', urgencia: 'media' },
            { tipo: 'usuarios', mensaje: '8 nuevos usuarios registrados hoy', urgencia: 'baja' }
        ];
        return await simularRequest(alertasData);
    }, [simularRequest]);

    // Obtener resumen de usuarios
    const obtenerResumenUsuarios = useCallback(async () => {
        const usuariosData = {
            total: 89,
            nuevosHoy: 8,
            activos: 67,
            inactivos: 22
        };
        return await simularRequest(usuariosData);
    }, [simularRequest]);

    // Verificar permisos de admin
    const verificarPermisos = useCallback(() => {
        return estaAutenticado && esAdmin;
    }, [estaAutenticado, esAdmin]);

    // Limpiar errores
    const limpiarError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        verificarPermisos,
        obtenerEstadisticas,
        obtenerDatosVentas,
        obtenerProductosMasVendidos,
        obtenerAlertas,
        obtenerResumenUsuarios,
        limpiarError
    };
};

export default useAdmin; 