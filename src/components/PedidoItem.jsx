import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PedidoItem = ({ pedido }) => {
  const [expandido, setExpandido] = useState(false);
  
  // Formatear fecha según la localización
  const formatearFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha no disponible';
    }
  };

  // Determinar el color de estado según el estado del pedido
  const colorEstado = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'enviado':
        return 'bg-blue-100 text-blue-800';
      case 'procesando':
        return 'bg-yellow-100 text-yellow-800';
      case 'pendiente':
        return 'bg-orange-100 text-orange-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-[#FFF8ED] rounded-lg border border-[#D3B178] overflow-hidden shadow-sm">
      {/* Cabecera del pedido (siempre visible) */}
      <div 
        className="p-4 flex flex-wrap md:flex-nowrap justify-between items-center cursor-pointer"
        onClick={() => setExpandido(!expandido)}
      >
        <div className="flex-grow">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <p className="font-medium text-[#5E3B00]">
              Pedido #{pedido._id || pedido.pedidoId}
            </p>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorEstado(pedido.estado)}`}>
              {pedido.estado?.charAt(0).toUpperCase() + pedido.estado?.slice(1) || 'Estado desconocido'}
            </span>
          </div>
          <p className="text-sm text-[#815100] mt-1">
            {formatearFecha(pedido.fecha)}
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <span className="text-[#088714] font-bold">
            ${pedido.total?.toLocaleString('es-AR') || '0'}
          </span>
          {expandido ? (
            <FaChevronUp className="text-[#5E3B00]" />
          ) : (
            <FaChevronDown className="text-[#5E3B00]" />
          )}
        </div>
      </div>
      
      {/* Detalles del pedido (expandible) */}
      {expandido && (
        <div className="border-t border-[#D3B178] p-4">
          <h4 className="font-medium text-[#5E3B00] mb-2">Productos:</h4>
          <div className="space-y-2 mb-4">
            {pedido.productos && pedido.productos.length > 0 ? (
              pedido.productos.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {item.imagen && (
                      <img 
                        src={item.imagen} 
                        alt={item.nombre} 
                        className="w-10 h-10 object-cover rounded-md"
                        
                      />
                    )}
                    <span>
                      {item.cantidad}x {item.nombre}
                    </span>
                  </div>
                  <span className="text-[#5E3B00] font-medium">
                    ${item.precio?.toLocaleString('es-AR') || '0'}
                  </span>
                </div>
              ))
            ) : (
              // Compatibilidad con el formato anterior de pedidos
              pedido.items && pedido.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span>
                    {item.cantidad}x {item.producto}
                  </span>
                  <span className="text-[#5E3B00] font-medium">
                    ${item.precio?.toLocaleString('es-AR') || '0'}
                  </span>
                </div>
              ))
            )}
          </div>
          
          <div className="border-t border-[#D3B178] mt-3 pt-3 flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="text-[#088714] font-bold text-lg">
              ${pedido.total?.toLocaleString('es-AR') || '0'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidoItem;
