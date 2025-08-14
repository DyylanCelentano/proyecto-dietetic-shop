import { useState } from 'react'

const VentasPorCategoria = ({ datos, loading }) => {
    const [tooltipData, setTooltipData] = useState(null)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

    // Colores para cada categoría
    const colores = {
        'Frutos Secos': '#8B5A3C',
        'Semillas': '#D2B48C',
        'Cereales': '#F4A460',
        'Legumbres': '#DEB887',
        'Otros': '#CD853F'
    }

    const formatearMoneda = (valor) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(valor)
    }

    const formatearMonedaCorta = (valor) => {
        if (valor >= 1000000) {
            return `$${(valor / 1000000).toFixed(1)}M`
        } else if (valor >= 1000) {
            return `$${(valor / 1000).toFixed(0)}K`
        }
        return formatearMoneda(valor)
    }

    const manejarMouseOver = (categoria, event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        setTooltipData(categoria)
        setTooltipPosition({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        })
    }

    const manejarMouseOut = () => {
        setTooltipData(null)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#815100]"></div>
            </div>
        )
    }

    const total = datos.reduce((sum, item) => sum + item.ventas, 0)

    return (
        <div className="relative">
            {/* Layout principal: Gráfico arriba y leyenda abajo */}
            <div className="flex flex-col items-center space-y-4">
                {/* Gráfico de Dona más grande */}
                <div className="relative">
                    <svg width="200" height="200" className="transform -rotate-90 sm:w-[240px] sm:h-[240px]" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet">
                        {datos.map((item, index) => {
                            const radius = 85
                            const strokeWidth = 25
                            
                            // Calcular ángulos
                            const startAngle = datos
                                .slice(0, index)
                                .reduce((sum, prev) => sum + (prev.porcentaje * 3.6), 0)
                            const endAngle = startAngle + (item.porcentaje * 3.6)
                            
                            // Convertir a radianes
                            const startAngleRad = (startAngle * Math.PI) / 180
                            const endAngleRad = (endAngle * Math.PI) / 180
                            
                            // Calcular puntos del arco
                            const x1 = 120 + radius * Math.cos(startAngleRad)
                            const y1 = 120 + radius * Math.sin(startAngleRad)
                            const x2 = 120 + radius * Math.cos(endAngleRad)
                            const y2 = 120 + radius * Math.sin(endAngleRad)
                            
                            const largeArcFlag = item.porcentaje > 50 ? 1 : 0
                            
                            const pathData = [
                                `M 120 120`,
                                `L ${x1} ${y1}`,
                                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                `Z`
                            ].join(' ')
                            
                            return (
                                <path
                                    key={item.categoria}
                                    d={pathData}
                                    fill={colores[item.categoria] || '#CD853F'}
                                    stroke="white"
                                    strokeWidth="3"
                                    className="cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105"
                                    style={{ transformOrigin: '120px 120px' }}
                                    onMouseOver={(e) => manejarMouseOver(item, e)}
                                    onMouseOut={manejarMouseOut}
                                />
                            )
                        })}
                        
                        {/* Círculo interior más grande para mejor legibilidad */}
                        <circle
                            cx="120"
                            cy="120"
                            r="55"
                            fill="white"
                        />
                    </svg>
                    
                    {/* Centro del gráfico con mejor tamaño */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-base sm:text-lg font-['Epilogue'] font-bold text-[#3A2400] leading-tight">
                                {formatearMonedaCorta(total)}
                            </p>
                            <p className="text-xs font-['Gabarito'] text-[#4D3000] leading-tight">
                                Total Ventas
                            </p>
                        </div>
                    </div>
                </div>

                {/* Leyenda horizontal compacta */}
                <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {datos.map((item) => (
                            <div
                                key={item.categoria}
                                className="flex items-center justify-between p-2 bg-[#FFF8ED] rounded border border-[#D3B178] hover:bg-[#FFF1D9] transition-colors cursor-pointer text-xs sm:text-sm"
                                onMouseOver={(e) => manejarMouseOver(item, e)}
                                onMouseOut={manejarMouseOut}
                            >
                                <div className="flex items-center space-x-2">
                                    <div 
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: colores[item.categoria] || '#CD853F' }}
                                    ></div>
                                    <span className="font-['Gabarito'] font-medium text-[#3A2400] truncate">
                                        {item.categoria}
                                    </span>
                                </div>
                                <div className="text-right ml-2 flex-shrink-0">
                                    <p className="font-['Epilogue'] font-bold text-[#3A2400]">
                                        {item.porcentaje}%
                                    </p>
                                    <p className="text-xs font-['Gabarito'] text-[#4D3000]">
                                        {formatearMonedaCorta(item.ventas)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tooltip */}
            {tooltipData && (
                <div
                    className="absolute z-10 bg-[#3A2400] text-white p-2 sm:p-3 rounded-lg shadow-lg border pointer-events-none max-w-[200px] sm:max-w-none"
                    style={{
                        left: Math.min(tooltipPosition.x + 10, window.innerWidth - 220),
                        top: tooltipPosition.y - 10,
                        transform: tooltipPosition.x > 150 ? 'translateX(-100%)' : 'none'
                    }}
                >
                    <div className="text-xs sm:text-sm font-['Gabarito']">
                        <p className="font-semibold">{tooltipData.categoria}</p>
                        <p>Ventas: {formatearMoneda(tooltipData.ventas)}</p>
                        <p>Porcentaje: {tooltipData.porcentaje}%</p>
                        <p>Productos: {tooltipData.productos || 'N/A'} unidades</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VentasPorCategoria
