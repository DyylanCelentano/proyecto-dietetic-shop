
const StatsCard = ({ titulo, valor, icono, color, loading, tendencia, porcentaje }) => {
    return (
        <div className={`bg-[#FFF8ED] rounded-lg shadow-md p-4 sm:p-6 border ${color} transition-all duration-200 hover:shadow-lg`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                        <span className="text-brand-primary">{icono}</span>
                        <h3 className="text-xs sm:text-sm font-['Gabarito'] font-medium text-brand-text/80">
                            {titulo}
                        </h3>
                    </div>
                    
                    {loading ? (
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
                            {tendencia && (
                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                            )}
                        </div>
                    ) : (
                        <>
                            <p className="text-lg sm:text-2xl font-['Epilogue'] font-bold text-brand-text mb-1">
                                {valor}
                            </p>
                            
                            {tendencia && porcentaje && (
                                <div className="flex items-center space-x-1">
                                    <span className={`text-xs font-['Gabarito'] ${
                                        tendencia === 'up' ? 'text-brand-success' : 'text-red-600'
                                    }`}>
                                        {tendencia === 'up' ? '↗' : '↘'} {porcentaje}%
                                    </span>
                                    <span className="text-xs text-brand-text/80">
                                        vs mes anterior
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
                
                {/* Indicador de estado */}
                {!loading && (
                    <div className={`w-3 h-3 rounded-full ${
                        color.includes('green') ? 'bg-brand-success' :
                        color.includes('blue') ? 'bg-blue-500' :
                        color.includes('purple') ? 'bg-purple-500' :
                        color.includes('orange') ? 'bg-brand-accent' :
                        color.includes('yellow') ? 'bg-brand-accent' :
                        color.includes('red') ? 'bg-red-500' : 'bg-gray-500'
                    }`}></div>
                )}
            </div>
        </div>
    )
}

export default StatsCard 