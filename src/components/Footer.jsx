
const Footer = () => {
  return (
    <>
      <footer className="text-center mt-10 py-8 bg-[#D3B178] text-lg font-['Gabarito']">
        <div className="mb-4">
          <a href="#" className="hover:underline">Preguntas frecuentes | </a>
          <a href="#" className="hover:underline">Política de privacidad | </a>
          <a href="#" className="hover:underline">Términos de servicio | </a>
          <a href="#" className="hover:underline">Contacto</a>
        </div>
        <div className="flex justify-center space-x-6 mb-4 text-xl">
          <a href="#" aria-label="Facebook">
            <i className="fab fa-facebook"></i>
          </a>
          <a href="#" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" aria-label="WhatsApp">
            <i className="fab fa-whatsapp"></i>
          </a>
        </div>
        <div className="opacity-80">&copy;2025 Dietetic&#8722;Shop. Todos los derechos reservados.</div>
      </footer>
    </>
  )
}

export default Footer
