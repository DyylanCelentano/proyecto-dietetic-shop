import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'
import Checkout from './components/Checkout.jsx'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ToastContainer from './components/ui/ToastContainer'
import { AuthProvider } from './hooks/useAuth.jsx'
import { CartProvider } from './hooks/useCart.jsx'
import useToast from './hooks/useToast.jsx'
import AdminConfiguracion from './pages/admin/AdminConfiguracion'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminFinanzas from './pages/admin/AdminFinanzas'
import AdminPedidos from './pages/admin/AdminPedidos'
import AdminProductos from './pages/admin/AdminProductos'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import Blog from './pages/Blog'
import Home from './pages/Home'
import Login from './pages/Login'
import Productos from './pages/Productos'
import Register from './pages/Register'

function Layout({ children }) {
  const location = useLocation()
  const hideLayout = location.pathname === '/login' || location.pathname === '/register'
  const isAdminRoute = location.pathname.startsWith('/admin')
  
  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && !isAdminRoute && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideLayout && !isAdminRoute && <Footer />}
    </div>
  )
}

function App() {
  const { toasts, cerrarToast } = useToast();

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas del Panel Administrativo */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/productos" element={<AdminProductos />} />
              <Route path="/admin/finanzas" element={<AdminFinanzas />} />
              <Route path="/admin/pedidos" element={<AdminPedidos />} />
              <Route path="/admin/usuarios" element={<AdminUsuarios />} />
              <Route path="/admin/configuracion" element={<AdminConfiguracion />} />
            </Routes>
          </Layout>
          <ToastContainer toasts={toasts} onCerrar={cerrarToast} />
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
