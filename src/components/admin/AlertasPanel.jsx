import React from 'react';

const AlertasPanel = ({ loading }) => {
    const alertas = [
        {
            id: 1,
            tipo: 'stock',
            titulo: 'Stock bajo en productos',
            descripcion: '5 productos tienen stock bajo',
            prioridad: 'alta',
            icono: '⚠️'
        },
        {
            id: 2,
            tipo: 'pedido',
            titulo: 'Pedidos pendientes',
            descripcion: '3 pedidos esperando procesamiento',
            prioridad: 'media',
            icono: '📦'
        },
        {
            id: 3,
            tipo: 'financiero',
            titulo: 'Meta de ventas',
            descripcion: 'Faltan $2,500 para alcanzar la meta mensual',
            prioridad: 'baja',
            icono: '💰'
        }
    ];

    const getPrioridadColor = (prioridad) => {
        switch (prioridad) {
            case 'alta':
                return 'border-red-300 bg-red-50';
            case 'media':
                return 'border-yellow-300 bg-yellow-50';
            case 'baja':
                return 'border-blue-300 bg-blue-50';
            default:
                return 'border-gray-300 bg-gray-50';
        }
    };

    const getPrioridadText = (prioridad) => {
        switch (prioridad) {
            case 'alta':
                return 'Alta';
            case 'media':
                return 'Media';
            case 'baja':
                return 'Baja';
            default:
                return 'Normal';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178]">
                <h3 className="text-lg font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                    ⚠️ Alertas Importantes
                </h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-[#D3B178]">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-['Epilogue'] font-semibold text-[#3A2400]">
                    ⚠️ Alertas Importantes
                </h3>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-['Gabarito']">
                    {alertas.length} alertas
                </span>
            </div>

            <div className="space-y-3">
                {alertas.map((alerta) => (
                    <div
                        key={alerta.id}
                        className={`p-3 rounded-lg border-l-4 ${getPrioridadColor(alerta.prioridad)} transition-all duration-200 hover:shadow-md`}
                    >
                        <div className="flex items-start space-x-3">
                            <span className="text-xl">{alerta.icono}</span>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h4 className="text-sm font-['Gabarito'] font-medium text-[#3A2400]">
                                        {alerta.titulo}
                                    </h4>
                                    <span className={`text-xs px-2 py-1 rounded-full font-['Gabarito'] ${
                                        alerta.prioridad === 'alta' ? 'bg-red-200 text-red-800' :
                                        alerta.prioridad === 'media' ? 'bg-yellow-200 text-yellow-800' :
                                        'bg-blue-200 text-blue-800'
                                    }`}>
                                        {getPrioridadText(alerta.prioridad)}
                                    </span>
                                </div>
                                <p className="text-xs text-[#4D3000] opacity-75">
                                    {alerta.descripcion}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {alertas.length === 0 && (
                <div className="text-center py-6">
                    <div className="text-3xl mb-2">✅</div>
                    <p className="text-[#4D3000] font-['Gabarito']">
                        No hay alertas pendientes
                    </p>
                    <p className="text-xs text-[#4D3000] opacity-75 mt-1">
                        Todo está funcionando correctamente
                    </p>
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-[#D3B178]">
                <button className="w-full text-sm font-['Gabarito'] text-[#815100] hover:text-[#3A2400] transition-colors">
                    Ver todas las alertas →
                </button>
            </div>
        </div>
    );
};

export default AlertasPanel; 