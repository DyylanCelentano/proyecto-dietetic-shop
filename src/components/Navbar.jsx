import { Link } from 'react-router-dom'
const Navbar = () => {

  return (
    <nav className="bg-[#D3B178] px-[5%] py-4 flex justify-between items-center shadow-md border-b-[3px] border-[#5E3B00]">
      <Link to="/" className="text-2xl font-['Epilogue'] font-extrabold text-[#3A2400] drop-shadow-[2px_2px_0_#FFDB9E]">
        Dietetic&#8722;Shop
      </Link>
      <div className="flex items-center space-x-14">
        <Link to="/" 
            className="inline-block px-2 text-lg text-[#3A2400] font-['Gabarito'] font-bold hover:bg-[#815100] hover:text-white rounded-2xl transition duration"
          >
          INICIO
        </Link>
        <Link to="/productos" 
            className="inline-block px-2 text-lg text-[#3A2400] font-['Gabarito'] font-bold hover:bg-[#815100] hover:text-white rounded-2xl transition duration"
          >
          PRODUCTOS
        </Link>
        <Link to="/blog" 
            className="inline-block px-2 text-lg text-[#3A2400] font-['Gabarito'] font-bold hover:bg-[#815100] hover:text-white rounded-2xl transition duration"
          >
          BLOG
        </Link>
      </div>
        <div className="flex items-center space-x-10 ml-4">
          <Link to="/login">
            <i className="fas fa-user text-xl text-[#3A2400] hover:text-black transition-colors"></i>
          </Link>          
          <Link to="#">
            <i className="fas fa-shopping-cart text-xl text-[#3A2400] hover:text-[#088714] transition-colors"></i>
          </Link>
        </div>
    </nav>
  )
}

export default Navbar
