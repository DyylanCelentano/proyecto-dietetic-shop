import { useNavigate } from "react-router-dom"
import AuthContainer from "../components/ui/AuthContainer"
import ModernButton from "../components/ui/ModernButton"
import ModernInput from "../components/ui/ModernInput"
import { useToast } from "../contexts/ToastContext"
import { useAuth } from "../hooks/useAuth.jsx"
import useFormularioAuth from "../hooks/useFormularioAuth"
import {
  iniciarSesion,
  validarFormularioLogin,
} from "../utils/validacionesAuth"

const Login = () => {
  const navigate = useNavigate()
  const { iniciarSesion: iniciarSesionContext } = useAuth()
  const { mostrarExito, mostrarError } = useToast()

  // Valores iniciales del formulario
  const valoresIniciales = {
    email: "",
    password: "",
  }

  // Hook personalizado para manejar el formulario
  const {
    datosFormulario,
    errores,
    cargando,
    manejarCambio,
    validarFormulario,
    establecerCargando,
    establecerErrores,
  } = useFormularioAuth(valoresIniciales, validarFormularioLogin)


  const manejarEnvio = async (evento) => {
    evento.preventDefault()

    if (!validarFormulario()) {
      return
    }

    establecerCargando(true)

    try {
      const resultado = await iniciarSesion(datosFormulario)

      if (resultado.exito) {
        iniciarSesionContext(resultado.usuario, resultado.token)
        mostrarExito("¡Sesión iniciada exitosamente!", 5000)
        // Esperar un momento antes de redirigir para asegurar que el usuario vea el mensaje
        setTimeout(() => {
          navigate("/")
        }, 1000)
      }
    } catch (error) {
      const mensajeError = error.message || "Error al iniciar sesión. Por favor intenta nuevamente."
      establecerErrores({
        general: mensajeError,
      })
      mostrarError(mensajeError)
    } finally {
      establecerCargando(false)
    }
  }


// Función eliminada - no se requiere autenticación con Google

  return (
    <AuthContainer mode="login">
      {/* Mensaje de error general */}
      {errores.general && (
        <div className="alerta-error mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{errores.general}</p>
        </div>
      )}

      {/* Formulario de login */}
      <form onSubmit={manejarEnvio} className="formulario-login space-y-5">
        <ModernInput
          type="email"
          name="email"
          value={datosFormulario.email}
          onChange={manejarCambio}
          placeholder="Email"
          icon="email"
          required
          error={errores.email}
        />

        <ModernInput
          type="password"
          name="password"
          value={datosFormulario.password}
          onChange={manejarCambio}
          placeholder="Contraseña"
          icon="password"
          required
          error={errores.password}
        />

        <ModernButton
          type="submit"
          variant="primary"
          size="lg"
          loading={cargando}
          className="w-full"
        >
          {cargando ? "Iniciando sesión..." : "Iniciar Sesión"}
        </ModernButton>
      </form>
    </AuthContainer>
  )
}

export default Login
