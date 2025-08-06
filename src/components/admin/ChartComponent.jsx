import { useState } from 'react';

const ChartComponent = ({ tipo, datos, loading, titulo, altura = 300 }) => {
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Datos simulados con fechas y valores
    const datosSimulados = [
        { fecha: '2024-10-01', ventas: 25400, pedidos: 12, productos: 45 },
        { fecha: '2024-10-02', ventas: 32100, pedidos: 18, productos: 62 },
        { fecha: '2024-10-03', ventas: 28600, pedidos: 15, productos: 53 },
        { fecha: '2024-10-04', ventas: 35800, pedidos: 22, productos: 71 },
        { fecha: '2024-10-05', ventas: 41200, pedidos: 28, productos: 89 },
        { fecha: '2024-10-06', ventas: 38900, pedidos: 24, productos: 82 },
        { fecha: '2024-10-07', ventas: 44500, pedidos: 31, productos: 95 }
    ];

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-AR', { 
            day: '2-digit', 
            month: '2-digit' 
        });
    };

    const formatearMoneda = (valor) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(valor);
    };

    const manejarMouseOver = (punto, event) => {
        const rect = event.currentTarget.closest('svg').getBoundingClientRect();
        setTooltipData(punto);
        setTooltipPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        });
    };

    const manejarMouseOut = () => {
        setTooltipData(null);
    };

    // Componente temporal para gráficos (se puede integrar Chart.js o Recharts después)
    const renderChart = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D3B178]"></div>
                </div>
            );
        }

        if (!datos || datos.length === 0) {
            return (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p className="text-[#4D3000] font-['Gabarito']">
                            No hay datos disponibles
                        </p>
                        <p className="text-sm text-[#4D3000] opacity-75">
                            Los gráficos se mostrarán cuando haya datos
                        </p>
                    </div>
                </div>
            );
        }

        // Gráfico de líneas mejorado con tooltips
        if (tipo === 'linea') {
            const maxVentas = Math.max(...datosSimulados.map(d => d.ventas));
            const minVentas = Math.min(...datosSimulados.map(d => d.ventas));
            const rangoVentas = maxVentas - minVentas;

            return (
                <div className="relative h-full">
                    <svg className="w-full h-full" viewBox="0 0 500 250">
                        {/* Grid */}
                        <defs>
                            <pattern id="grid" width="50" height="30" patternUnits="userSpaceOnUse">
                                <path d="M 50 0 L 0 0 0 30" fill="none" stroke="#FFF1D9" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        
                        {/* Ejes */}
                        <line x1="60" y1="200" x2="450" y2="200" stroke="#D3B178" strokeWidth="2"/>
                        <line x1="60" y1="30" x2="60" y2="200" stroke="#D3B178" strokeWidth="2"/>
                        
                        {/* Etiquetas del eje Y */}
                        <text x="50" y="35" textAnchor="end" fontSize="10" fill="#4D3000">
                            {formatearMoneda(maxVentas)}
                        </text>
                        <text x="50" y="120" textAnchor="end" fontSize="10" fill="#4D3000">
                            {formatearMoneda((maxVentas + minVentas) / 2)}
                        </text>
                        <text x="50" y="205" textAnchor="end" fontSize="10" fill="#4D3000">
                            {formatearMoneda(minVentas)}
                        </text>
                        
                        {/* Línea de datos */}
                        <path
                            d={datosSimulados.map((punto, index) => {
                                const x = 60 + (index * 55);
                                const y = 200 - ((punto.ventas - minVentas) / rangoVentas) * 170;
                                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                            }).join(' ')}
                            fill="none"
                            stroke="#815100"
                            strokeWidth="3"
                        />
                        
                        {/* Puntos de datos */}
                        {datosSimulados.map((punto, index) => {
                            const x = 60 + (index * 55);
                            const y = 200 - ((punto.ventas - minVentas) / rangoVentas) * 170;
                            return (
                                <g key={index}>
                                    <circle 
                                        cx={x} 
                                        cy={y} 
                                        r="6" 
                                        fill="#815100"
                                        onMouseOver={(e) => manejarMouseOver(punto, e)}
                                        onMouseOut={manejarMouseOut}
                                        className="cursor-pointer hover:fill-[#5E3B00] transition-colors"
                                    />
                                    {/* Etiquetas del eje X */}
                                    <text 
                                        x={x} 
                                        y="220" 
                                        textAnchor="middle" 
                                        fontSize="10" 
                                        fill="#4D3000"
                                    >
                                        {formatearFecha(punto.fecha)}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                    
                    {/* Tooltip */}
                    {tooltipData && (
                        <div 
                            className="absolute bg-white border border-[#D3B178] rounded-lg shadow-lg p-3 pointer-events-none z-10"
                            style={{
                                left: tooltipPosition.x + 10,
                                top: tooltipPosition.y - 80,
                                transform: tooltipPosition.x > 300 ? 'translateX(-100%)' : 'none'
                            }}
                        >
                            <div className="text-sm font-['Gabarito']">
                                <div className="font-semibold text-[#3A2400] mb-1">
                                    {new Date(tooltipData.fecha).toLocaleDateString('es-AR', {
                                        weekday: 'long',
                                        day: '2-digit',
                                        month: 'long'
                                    })}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#4D3000]">💰 Ventas:</span>
                                        <span className="font-semibold text-[#815100]">
                                            {formatearMoneda(tooltipData.ventas)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#4D3000]">📦 Pedidos:</span>
                                        <span className="font-semibold text-[#3A2400]">
                                            {tooltipData.pedidos}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#4D3000]">🛍️ Productos:</span>
                                        <span className="font-semibold text-[#3A2400]">
                                            {tooltipData.productos}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Gráfico de barras simple (placeholder)
        if (tipo === 'barras') {
            return (
                <div className="relative h-full">
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                        {/* Ejes */}
                        <line x1="50" y1="180" x2="350" y2="180" stroke="#D3B178" strokeWidth="2"/>
                        <line x1="50" y1="20" x2="50" y2="180" stroke="#D3B178" strokeWidth="2"/>
                        
                        {/* Barras */}
                        <rect x="60" y="120" width="30" height="60" fill="#815100" rx="2"/>
                        <rect x="110" y="100" width="30" height="80" fill="#815100" rx="2"/>
                        <rect x="160" y="140" width="30" height="40" fill="#815100" rx="2"/>
                        <rect x="210" y="80" width="30" height="100" fill="#815100" rx="2"/>
                        <rect x="260" y="60" width="30" height="120" fill="#815100" rx="2"/>
                        <rect x="310" y="40" width="30" height="140" fill="#815100" rx="2"/>
                        
                        {/* Etiquetas */}
                        <text x="75" y="195" textAnchor="middle" fontSize="12" fill="#4D3000">L</text>
                        <text x="125" y="195" textAnchor="middle" fontSize="12" fill="#4D3000">M</text>
                        <text x="175" y="195" textAnchor="middle" fontSize="12" fill="#4D3000">X</text>
                        <text x="225" y="195" textAnchor="middle" fontSize="12" fill="#4D3000">J</text>
                        <text x="275" y="195" textAnchor="middle" fontSize="12" fill="#4D3000">V</text>
                        <text x="325" y="195" textAnchor="middle" fontSize="12" fill="#4D3000">S</text>
                    </svg>
                </div>
            );
        }

        // Gráfico circular simple (placeholder)
        if (tipo === 'circular') {
            return (
                <div className="relative h-full">
                    <svg className="w-full h-full" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#FFF1D9" strokeWidth="10"/>
                        <circle cx="100" cy="100" r="80" fill="none" stroke="#815100" strokeWidth="10" 
                                strokeDasharray="251.2" strokeDashoffset="75.36" transform="rotate(-90 100 100)"/>
                        <text x="100" y="105" textAnchor="middle" fontSize="20" fill="#3A2400" fontWeight="bold">70%</text>
                    </svg>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-[#4D3000] font-['Gabarito']">Tipo de gráfico no soportado</p>
            </div>
        );
    };

    return (
        <div 
            className="bg-[#FFF8ED] rounded-lg p-4 border border-[#D3B178]" 
            style={{ height: altura }}
        >
            {titulo && (
                <h3 className="text-lg font-['Epilogue'] font-semibold text-[#3A2400] mb-4">
                    {titulo}
                </h3>
            )}
            <div className="h-full">
                {renderChart()}
            </div>
        </div>
    );
};

export default ChartComponent;
