import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const validate = (formData) => {
  const errors = {};

  // Validación del nombre
  if (!formData.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.';
  } else if (formData.nombre.length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres.';
  } else if (formData.nombre.length > 50) {
    errors.nombre = 'El nombre no puede exceder los 50 caracteres.';
  }

  // Validación de la dirección
  if (!formData.direccion.trim()) {
    errors.direccion = 'La dirección es obligatoria.';
  } else if (!/.*\d/.test(formData.direccion)) {
    errors.direccion = 'La dirección debe incluir un número.';
  }

  // Validación de la ciudad
  if (!formData.ciudad.trim()) {
    errors.ciudad = 'La ciudad es obligatoria.';
  } else if (formData.ciudad.length < 3) {
    errors.ciudad = 'La ciudad debe tener al menos 3 caracteres.';
  } else if (formData.ciudad.length > 50) {
    errors.ciudad = 'La ciudad no puede exceder los 50 caracteres.';
  }

  // Validación del código postal
  if (!formData.codigoPostal.trim()) {
    errors.codigoPostal = 'El código postal es obligatorio.';
  } else if (!/^[A-Za-z]?\d{4}[A-Za-z]{0,3}$/.test(formData.codigoPostal)) {
    errors.codigoPostal = 'Ingresa un código postal válido (ej: B1824, 1824, C1425).';
  }

  return errors;
};

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    metodoPago: 'tarjeta',
  });
  const [errors, setErrors] = useState({});
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      const formErrors = validate(formData);
      setErrors(formErrors);
      if (Object.keys(formErrors).length === 0) {
        setStep(prev => prev + 1);
      }
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleConfirmPurchase = () => {
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
  const claseErrorInput = 'border-red-500 focus:ring-red-500';
  const claseErrorTexto = 'text-red-500 text-xs mt-1';

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
              <form onSubmit={handleNextStep} noValidate>
                <h3 className="text-2xl font-semibold text-[#4D3000] mb-6">Información de Envío</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Nombre Completo<span className='text-red-500'>*</span></label>
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className={`${claseInput} ${errors.nombre && claseErrorInput}`} />
                    {errors.nombre && <p className={claseErrorTexto}>{errors.nombre}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Dirección<span className='text-red-500'>*</span></label>
                    <input type="text" name="direccion" value={formData.direccion} onChange={handleInputChange} className={`${claseInput} ${errors.direccion && claseErrorInput}`} />
                    {errors.direccion && <p className={claseErrorTexto}>{errors.direccion}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Ciudad<span className='text-red-500'>*</span></label>
                    <input type="text" name="ciudad" value={formData.ciudad} onChange={handleInputChange} className={`${claseInput} ${errors.ciudad && claseErrorInput}`} />
                    {errors.ciudad && <p className={claseErrorTexto}>{errors.ciudad}</p>}
                  </div>
                  <div>
                    <label className="block text-sm text-[#4D3000] mb-1 font-semibold">Código Postal<span className='text-red-500'>*</span></label>
                    <input type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleInputChange} className={`${claseInput} ${errors.codigoPostal && claseErrorInput}`} />
                    {errors.codigoPostal && <p className={claseErrorTexto}>{errors.codigoPostal}</p>}
                  </div>
                </div>
                <button type="submit" className="w-full mt-8 bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700">Siguiente</button>
              </form>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-2xl font-semibold text-[#4D3000] mb-6">Método de Pago</h3>
                <div className="space-y-4">
                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${formData.metodoPago === 'tarjeta' ? 'border-[#815100] ring-2 ring-[#815100]' : 'border-[#D3B178]'}`}>
                        <input type="radio" name="metodoPago" value="tarjeta" checked={formData.metodoPago === 'tarjeta'} onChange={handleInputChange} className="hidden" />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4D3000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 11h18m-2 4H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-lg font-semibold text-[#4D3000]">Tarjeta de Crédito / Débito</span>
                    </label>
                    <label className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${formData.metodoPago === 'mercadopago' ? 'border-[#815100] ring-2 ring-[#815100]' : 'border-[#D3B178]'}`}>
                        <input type="radio" name="metodoPago" value="mercadopago" checked={formData.metodoPago === 'mercadopago'} onChange={handleInputChange} className="hidden" />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M11.115 16.479a.93.927 0 0 1-.939-.886c-.002-.042-.006-.155-.103-.155c-.04 0-.074.023-.113.059c-.112.103-.254.206-.46.206a.816.814 0 0 1-.305-.066c-.535-.214-.542-.578-.521-.725c.006-.038.007-.08-.02-.11l-.032-.03h-.034c-.027 0-.055.012-.093.039a.788.786 0 0 1-.454.16a.7.699 0 0 1-.253-.05c-.708-.27-.65-.928-.617-1.126q.008-.062-.03-.092l-.05-.04l-.047.043a.728.726 0 0 1-.505.203a.73.728 0 0 1-.732-.725c0-.4.328-.722.732-.722c.364 0 .675.27.721.63l.026.195l.11-.165c.01-.018.307-.46.852-.46c.102 0 .21.016.316.05c.434.13.508.52.519.68c.008.094.075.1.09.1c.037 0 .064-.024.083-.045a.746.744 0 0 1 .54-.225q.193 0 .402.09c.69.293.379 1.158.374 1.167c-.058.144-.061.207-.005.244l.027.013h.02c.03 0 .07-.014.134-.035c.093-.032.235-.08.367-.08a.944.942 0 0 1 .94.93a.936.934 0 0 1-.94.928m7.302-4.171c-1.138-.98-3.768-3.24-4.481-3.77c-.406-.302-.685-.462-.928-.533a1.559 1.554 0 0 0-.456-.07q-.274 0-.58.095c-.46.145-.918.505-1.362.854l-.023.018c-.414.324-.84.66-1.164.73a1.986 1.98 0 0 1-.43.049c-.362 0-.687-.104-.81-.258q-.03-.037.04-.125l.008-.008l1-1.067c.783-.774 1.525-1.506 3.23-1.545h.085c1.062 0 2.12.469 2.24.524a7 7 0 0 0 3.056.724c1.076 0 2.188-.263 3.354-.795a9.135 9.11 0 0 0-.405-.317c-1.025.44-2.003.66-2.946.66c-.962 0-1.925-.229-2.858-.68c-.05-.022-1.22-.567-2.44-.57q-.049 0-.096.002c-1.434.033-2.24.536-2.782.976c-.528.013-.982.138-1.388.25c-.361.1-.673.186-.979.185c-.125 0-.35-.01-.37-.012c-.35-.01-2.115-.437-3.518-.962q-.213.15-.415.31c1.466.593 3.25 1.053 3.812 1.089c.157.01.323.027.491.027c.372 0 .744-.103 1.104-.203c.213-.059.446-.123.692-.17l-.196.194l-1.017 1.087c-.08.08-.254.294-.14.557a.705.703 0 0 0 .268.292c.243.162.677.27 1.08.271q.23 0 .43-.044c.427-.095.874-.448 1.349-.82c.377-.296.913-.672 1.323-.782a1.494 1.49 0 0 1 .37-.05a.611.61 0 0 1 .095.005c.27.034.533.125 1.003.472c.835.62 4.531 3.815 4.566 3.846c.002.002.238.203.22.537c-.007.186-.11.352-.294.466a.902.9 0 0 1-.484.15a.804.802 0 0 1-.428-.124c-.014-.01-1.28-1.157-1.746-1.543c-.074-.06-.146-.115-.22-.115a.12.12 0 0 0-.096.045c-.073.09.01.212.105.294l1.48 1.47c.002 0 .184.17.204.395q.017.367-.35.606a.957.955 0 0 1-.526.171a.766.764 0 0 1-.42-.127l-.214-.206a21.035 20.978 0 0 0-1.08-1.009c-.072-.058-.148-.112-.221-.112a.13.13 0 0 0-.094.038c-.033.037-.056.103.028.212a.698.696 0 0 0 .075.083l1.078 1.198c.01.01.222.26.024.511l-.038.048a1.18 1.178 0 0 1-.1.096c-.184.15-.43.164-.527.164a.8.798 0 0 1-.147-.012q-.16-.027-.212-.089l-.013-.013c-.06-.06-.602-.609-1.054-.98c-.059-.05-.133-.11-.21-.11a.13.13 0 0 0-.096.042c-.09.096.044.24.1.293l.92 1.003a.2.2 0 0 1-.033.062c-.033.044-.144.155-.479.196a.91.907 0 0 1-.122.007c-.345 0-.712-.164-.902-.264a1.343 1.34 0 0 0 .13-.576a1.368 1.365 0 0 0-1.42-1.357c.024-.342-.025-.99-.697-1.274a1.455 1.452 0 0 0-.575-.125q-.22 0-.42.075a1.153 1.15 0 0 0-.671-.564a1.52 1.515 0 0 0-.494-.085q-.421 0-.767.242a1.168 1.165 0 0 0-.903-.43a1.173 1.17 0 0 0-.82.335c-.287-.217-1.425-.93-4.467-1.613a17.39 17.344 0 0 1-.692-.189a4.822 4.82 0 0 0-.077.494l.67.157c3.108.682 4.136 1.391 4.309 1.525a1.145 1.142 0 0 0-.09.442a1.16 1.158 0 0 0 1.378 1.132c.096.467.406.821.879 1.003a1.165 1.162 0 0 0 .415.08q.135 0 .266-.034c.086.22.282.493.722.668a1.233 1.23 0 0 0 .457.094q.183 0 .355-.063a1.373 1.37 0 0 0 1.269.841c.37.002.726-.147.985-.41c.221.121.688.341 1.163.341q.09.001.175-.01c.47-.059.689-.24.789-.382a.571.57 0 0 0 .048-.078c.11.032.234.058.373.058c.255 0 .501-.086.75-.265c.244-.174.418-.424.444-.637v-.01q.125.026.251.026c.265 0 .527-.082.773-.242c.48-.31.562-.715.554-.98a1.28 1.279 0 0 0 .978-.194a1.04 1.04 0 0 0 .502-.808a1.088 1.085 0 0 0-.16-.653c.804-.342 2.636-1.003 4.795-1.483a4.734 4.721 0 0 0-.067-.492a27.742 27.667 0 0 0-5.049 1.62zm5.123-.763c0 4.027-5.166 7.293-11.537 7.293S.465 15.572.465 11.545S5.63 4.252 12.004 4.252c6.371 0 11.537 3.265 11.537 7.293zm.46.004c0-4.272-5.374-7.755-12-7.755S.002 7.277.002 11.55L0 12.004c0 4.533 4.695 8.203 11.999 8.203c7.347 0 12-3.67 12-8.204z"/>
                        </svg>
                        <span className="text-lg font-semibold text-[#4D3000]">Mercado Pago</span>
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
                  <p><strong className="font-semibold">Método de Pago:</strong> {formData.metodoPago === 'tarjeta' ? 'Tarjeta' : 'Mercado Pago'}</p>
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