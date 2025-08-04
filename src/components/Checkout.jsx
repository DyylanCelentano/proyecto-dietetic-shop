import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    metodoPago: 'tarjeta',
  });
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    // Aquí podrías agregar validaciones para cada paso
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleConfirmPurchase = () => {
    // Simulación de procesamiento
    Swal.fire({
      title: '¡Compra Exitosa!',
      text: 'Gracias por tu compra. Recibirás un email con los detalles de tu pedido.',
      icon: 'success',
      confirmButtonColor: '#815100',
      confirmButtonText: 'Volver a la tienda'
    }).then(() => {
      clearCart();
      navigate('/productos');
    });
  };

  const claseInput = `w-full pl-4 pr-4 py-3 bg-[#FFF8ED] border border-[#D3B178] rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#815100] focus:bg-white focus:border-[#815100] text-[#3A2400] placeholder-[#5E3B00]/60 font-['Gabarito'] text-base`;

  return (
    <div className="bg-[#FFF8ED] min-h-screen p-6 font-['Gabarito'] flex justify-center">
      <div className="w-full max-w-4xl mt-10">
        <h2 className="text-3xl font-bold text-[#5E3B00] text-center mb-8">Proceso de Compra</h2>
        
        {/* Indicador de Pasos */}
        <div className="flex justify-center items-center mb-8">
          <div className={`flex items-center ${step >= 1 ? 'text-[#815100]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 1 ? 'bg-[#815100] text-white border-[#815100]' : 'border-gray-400'}`}>1</div>
            <span className="ml-2 font-semibold">Envío</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-[#815100]' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 2 ? 'text-[#815100]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 2 ? 'bg-[#815100] text-white border-[#815100]' : 'border-gray-400'}`}>2</div>
            <span className="ml-2 font-semibold">Pago</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-[#815100]' : 'bg-gray-300'}`}></div>
          <div className={`flex items-center ${step >= 3 ? 'text-[#815100]' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step >= 3 ? 'bg-[#815100] text-white border-[#815100]' : 'border-gray-400'}`}>3</div>
            <span className="ml-2 font-semibold">Confirmar</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna del Formulario */}
          <div className="bg-[#FFF1D9] p-8 rounded-xl shadow-md border border-[#5E3B00]">
            {step === 1 && (
              <form onSubmit={handleNextStep}>
                <h3 className="text-2xl font-semibold text-[#4D3000] mb-6">Información de Envío</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Nombre Completo</label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className={claseInput} required />
                  </div>
                  <div>
                    <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Dirección</label>
                    <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} className={claseInput} required />
                  </div>
                  <div>
                    <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Ciudad</label>
                    <input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} className={claseInput} required />
                  </div>
                  <div>
                    <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Código Postal</label>
                    <input type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} className={claseInput} required />
                  </div>
                </div>
                <button type="submit" className="w-full mt-8 bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700">Siguiente</button>
              </form>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-2xl font-semibold text-[#4D3000] mb-6">Método de Pago</h3>
                <div className="space-y-4">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.metodoPago === 'tarjeta' ? 'border-[#815100] ring-2 ring-[#815100]' : 'border-[#D3B178]'}`}>
                    <input type="radio" name="metodoPago" value="tarjeta" checked={formData.metodoPago === 'tarjeta'} onChange={handleInputChange} className="hidden" />
                    <span className="text-lg font-semibold text-[#4D3000]">Tarjeta de Crédito / Débito (Simulado)</span>
                  </label>
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.metodoPago === 'mercadopago' ? 'border-[#815100] ring-2 ring-[#815100]' : 'border-[#D3B178]'}`}>
                    <input type="radio" name="metodoPago" value="mercadopago" checked={formData.metodoPago === 'mercadopago'} onChange={handleInputChange} className="hidden" />
                    <span className="text-lg font-semibold text-[#4D3000]">Mercado Pago (Simulado)</span>
                  </label>
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={handlePrevStep} className="bg-gray-400 text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-500">Anterior</button>
                  <button onClick={handleNextStep} className="bg-green-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-700">Siguiente</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-2xl font-semibold text-[#4D3000] mb-6">Confirmar Pedido</h3>
                <div className="space-y-2 text-[#4D3000]">
                  <p><strong className="font-semibold">Enviar a:</strong> {formData.nombre}</p>
                  <p><strong className="font-semibold">Dirección:</strong> {formData.direccion}, {formData.ciudad}, {formData.codigoPostal}</p>
                  <p><strong className="font-semibold">Método de Pago:</strong> {formData.metodoPago === 'tarjeta' ? 'Tarjeta (Simulado)' : 'Mercado Pago (Simulado)'}</p>
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={handlePrevStep} className="bg-gray-400 text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-500">Anterior</button>
                  <button onClick={handleConfirmPurchase} className="bg-green-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-green-700">Confirmar Compra</button>
                </div>
              </div>
            )}
          </div>

          {/* Columna del Resumen del Pedido */}
          <div className="bg-[#FFF1D9] p-6 rounded-xl shadow-md border border-[#5E3B00] h-fit">
            <h3 className="text-xl font-semibold text-[#4D3000] mb-4 border-b border-[#D3B178] pb-2">Resumen del Pedido</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between items-center text-[#4D3000]">
                  <span>{item.nombre} x {item.quantity}</span>
                  <span className="font-semibold">${(item.precio * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-[#D3B178] flex justify-between font-bold text-xl text-[#5E3B00]">
              <span>Total:</span>
              <span className="text-[#088714]">${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
