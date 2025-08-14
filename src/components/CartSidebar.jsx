import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/format'

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, cartTotal } = useCart()
  const { estaAutenticado } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    onClose() // Cierra el sidebar antes de navegar
    if (!estaAutenticado) {
      navigate('/login')
    } else {
      navigate('/checkout') // Navega a la nueva página de checkout
    }
  }

  return (
    // Contenedor principal y overlay
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[90%] sm:max-w-md transform transition-transform duration-300 ease-in-out bg-[#FFF8ED] shadow-2xl border-l-4 border-[#5E3B00] font-['Gabarito'] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del sidebar lo cierre
      >
        {/* Encabezado */}
        <div className="flex justify-between items-center p-4 border-b-2 border-[#D3B178]">
          <h2 className="text-2xl font-bold text-[#5E3B00]">Tu Carrito</h2>
          <button onClick={onClose} className="text-3xl font-bold text-[#5E3B00] hover:text-red-600 transition-colors">x</button>
        </div>

        {/* Lista de Items */}
        <div className="p-4 overflow-y-auto h-[calc(100%-200px)]">
          {cartItems.length === 0 ? (
            <p className="text-center text-lg text-[#5E3B00] mt-10">Tu carrito está vacío.</p>
          ) : (
            cartItems.map(item => {
              // Calcular precio de manera segura
              const precioItem = item.precioUnitario || item.precioCalculado || item.precio || item.precioUnidad || 0
              
              return (
                <div key={item.itemId || item._id} className="flex flex-col sm:flex-row items-start sm:items-center mb-4 p-3 bg-[#FFF1D9] rounded-lg border border-[#D3B178]">
                  <img src={item.imagen || '/api/placeholder/64/64'} alt={item.nombre} className="w-16 h-16 object-cover rounded-md mb-2 sm:mb-0 sm:mr-4" />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-[#4D3000] text-sm sm:text-base line-clamp-2">{item.nombre}</p>
                      <button onClick={() => removeFromCart(item.itemId || item._id)} className="text-red-500 hover:text-red-700 font-semibold text-sm sm:hidden">
                        ✕
                      </button>
                    </div>
                    <p className="text-sm text-[#088714] font-semibold">{formatCurrency(precioItem, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    {item.cantidadEspecificada && item.unidadEspecificada && (
                      <p className="text-xs text-[#815100]">{item.cantidadEspecificada}{item.unidadEspecificada}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <button onClick={() => decreaseQuantity(item.itemId || item._id)} className="px-2 sm:px-3 py-1 bg-[#D3B178] text-[#4D3000] font-bold rounded-l-md hover:bg-[#b39869]">-</button>
                        <p className="px-3 sm:px-4 py-1 bg-white border-y border-[#D3B178] text-[#4D3000]">{item.quantity}</p>
                        <button onClick={() => increaseQuantity(item.itemId || item._id)} className="px-2 sm:px-3 py-1 bg-[#D3B178] text-[#4D3000] font-bold rounded-r-md hover:bg-[#b39869]">+</button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.itemId || item._id)} className="hidden sm:block text-red-500 hover:text-red-700 font-semibold ml-4">Quitar</button>
                </div>
              )
            })
          )}
        </div>

        {/* Pie del Carrito */}
        <div className="absolute bottom-0 left-0 w-full p-4 bg-[#FFF1D9] border-t-2 border-[#D3B178]">
          <div className="flex justify-between items-center font-bold text-xl mb-4 text-[#5E3B00]">
            <span>Total:</span>
            <span className="text-[#088714]">{formatCurrency(cartTotal || 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="w-full bg-red-500 text-white py-2 rounded-lg mb-2 font-semibold hover:bg-red-600 transition-colors"
            >
              Vaciar Carrito
            </button>
          )}
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartSidebar
