import { FaShoppingBag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NoOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#FFF1D9] p-8 rounded-lg text-center">
      <div className="flex justify-center mb-4">
        <FaShoppingBag className="text-5xl text-[#D3B178]" />
      </div>
      <h4 className="text-lg font-medium text-[#5E3B00] mb-3">
        No tienes pedidos registrados aún
      </h4>
      <p className="text-[#815100] mb-5">
        ¡Explora nuestra tienda y descubre productos naturales para una vida más saludable!
      </p>
      <button 
        onClick={() => navigate('/productos')}
        className="px-6 py-2 bg-[#D3B178] text-[#3A2400] rounded-lg hover:bg-[#b39869] transition-colors"
      >
        Ver productos
      </button>
    </div>
  );
};

export default NoOrders;
