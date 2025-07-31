import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useNotificaciones } from './hooks/useNotificaciones'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Notificacion from './components/ui/Notificacion'
import Blog from './pages/Blog'
import Home from './pages/Home'
import Login from './pages/Login'
import Productos from './pages/Productos'
import Register from './pages/Register'

// Componente para mostrar notificaciones
function NotificacionesContainer() {
  const { notificaciones, removerNotificacion } = useNotificaciones()

  return (
    <>
      {notificaciones.map((notificacion) => (
        <Notificacion
          key={notificacion.id}
          mensaje={notificacion.mensaje}
          tipo={notificacion.tipo}
          duracion={notificacion.duracion}
          onClose={() => removerNotificacion(notificacion.id)}
        />
      ))}
    </>
  )
}

function Layout({ children }) {
  const location = useLocation()
  const hideLayout = location.pathname === '/login' || location.pathname === '/register'
  return (
    <div className="min-h-screen flex flex-col">
      {!hideLayout && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideLayout && <Footer />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
          <NotificacionesContainer />
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App
