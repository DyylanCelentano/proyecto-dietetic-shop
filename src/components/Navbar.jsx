import { Link } from 'react-router-dom'
import { useState } from 'react'
import AuthButtons from './AuthButtons'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-[#D3B178] px-6 md:px-[5%] py-4 shadow-md border-b-[3px] border-[#5E3B00]">
      <div className="flex justify-between items-center w-full">

        <div className="flex-1">
          <Link
            to="/"
            className="text-2xl font-['Epilogue'] font-extrabold text-[#3A2400] drop-shadow-[2px_2px_0_#FFDB9E]"
          >
            Dietetic&#8722;Shop
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center space-x-10">
          <Link to="/" className="text-lg text-[#3A2400] font-['Gabarito'] font-bold hover:bg-[#815100] hover:text-white px-3 py-1 rounded-2xl">
            INICIO
          </Link>
          <Link to="/productos" className="text-lg text-[#3A2400] font-['Gabarito'] font-bold hover:bg-[#815100] hover:text-white px-3 py-1 rounded-2xl">
            PRODUCTOS
          </Link>
          <Link to="/blog" className="text-lg text-[#3A2400] font-['Gabarito'] font-bold hover:bg-[#815100] hover:text-white px-3 py-1 rounded-2xl">
            BLOG
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <AuthButtons />
            <Link to="#">
              <i className="fas fa-shopping-cart text-xl text-[#3A2400] hover:text-[#088714] transition-colors"></i>
            </Link>
          </div>

          {/* Menú hamburguesa */}
          <button
            className="md:hidden text-[#3A2400] text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Menú Mobile */}
      {menuOpen && (
        <div className="mt-4 flex flex-col space-y-4 md:hidden">
          <Link to="/" className="text-[#3A2400] font-['Gabarito'] font-bold hover:bg-[#815100] hover:text-white px-4 py-2 rounded-md">
            INICIO
          </Link>
          <Link to="/productos" className="text-[#3A2400] font-['Gabarito'] font-bold hover:bg-[#815100] hover:text-white px-4 py-2 rounded-md">
            PRODUCTOS
          </Link>
          <Link to="/blog" className="text-[#3A2400] font-['Gabarito'] font-bold hover:bg-[#815100] hover:text-white px-4 py-2 rounded-md">
            BLOG
          </Link>
          <div className="flex items-center space-x-6 px-4">
            <AuthButtons />
            <Link to="#">
              <i className="fas fa-shopping-cart text-xl text-[#3A2400] hover:text-[#088714]"></i>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
