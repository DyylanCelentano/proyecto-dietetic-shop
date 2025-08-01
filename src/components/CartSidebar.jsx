import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, cartTotal } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!usuario) {
      navigate('/login');
    } else {
      // Lógica para finalizar la compra
      alert('¡Gracias por tu compra!');
      clearCart();
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Carrito</h2>
        <button onClick={onClose} className="text-xl font-bold">&times;</button>
      </div>
      <div className="p-4 overflow-y-auto h-[calc(100%-140px)]">
        {cartItems.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          cartItems.map(item => (
            <div key={item._id} className="flex justify-between items-center mb-4">
              <div>
                <p className="font-bold">{item.nombre}</p>
                <p>${item.precio} x {item.quantity}</p>
                <div className="flex items-center">
                  <button onClick={() => decreaseQuantity(item._id)} className="px-2 border">-</button>
                  <p className="px-2">{item.quantity}</p>
                  <button onClick={() => increaseQuantity(item._id)} className="px-2 border">+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item._id)} className="text-red-500">Eliminar</button>
            </div>
          ))
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full p-4 border-t">
        <div className="flex justify-between items-center font-bold text-lg mb-4">
          <span>Total:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <button
          onClick={clearCart}
          className="w-full bg-red-500 text-white py-2 rounded mb-2"
        >
          Vaciar Carrito
        </button>
        <button
          onClick={handleCheckout}
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;
