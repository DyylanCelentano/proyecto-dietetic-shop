import { Link } from 'react-router-dom'
const Navbar = () => {

  return (
    <nav className="bg-[#F5F2F0] px-[5%] py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold text-black">
        Dietetic‑Shop
      </Link>
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-base hover:opacity-80 transition-opacity">
          Inicio
        </Link>
        <Link to="/productos" className="text-base hover:opacity-80 transition-opacity">
          Productos
        </Link>
        <Link to="/blog" className="text-base hover:opacity-80 transition-opacity">
          Blog
        </Link>
        <div className="flex items-center space-x-4 ml-4">
          <Link to="/login">
            <i className="fas fa-user text-xl hover:text-orange-600 transition-colors"></i>
          </Link>          <Link to="#">
            <i className="fas fa-shopping-cart text-xl hover:text-orange-600 transition-colors"></i>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
