import { useNavigate } from "react-router-dom"
import AuthContainer from "../components/ui/AuthContainer"
import ModernButton from "../components/ui/ModernButton"
import ModernInput from "../components/ui/ModernInput"
import { useToast } from "../contexts/ToastContext"
import { useAuth } from "../hooks/useAuth.jsx"
import useFormularioAuth from "../hooks/useFormularioAuth"
import {
  registrarUsuario,
  validarFormularioRegistro,
} from "../utils/validacionesAuth"

const Register = () => {
  const navigate = useNavigate()
  const { iniciarSesion: iniciarSesionContext } = useAuth()
  const { mostrarExito, mostrarError } = useToast()

  // Valores iniciales del formulario
  const valoresIniciales = {
    username: "",
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: {
      calle: "",
      numero: "",
      piso: "",
      departamento: "",
      ciudad: "",
      provincia: "",
      codigoPostal: ""
    }
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
  } = useFormularioAuth(valoresIniciales, validarFormularioRegistro)


  const manejarEnvio = async (evento) => {
    evento.preventDefault()

    if (!validarFormulario()) {
      return
    }

    establecerCargando(true)

    try {
      // Asegurarse de que el objeto tenga todos los campos necesarios
      const datosCompletos = {
        ...datosFormulario,
        // Si el usuario no ingresó un teléfono, asegurar que exista un valor vacío
        telefono: datosFormulario.telefono || "",
        // Asegurar que el objeto dirección esté inicializado correctamente
        direccion: datosFormulario.direccion || {
          calle: "",
          numero: "",
          piso: "",
          departamento: "",
          ciudad: "",
          provincia: "",
          codigoPostal: ""
        }
      }

      const resultado = await registrarUsuario(datosCompletos)

      if (resultado.exito) {
        // Si el registro incluye un token, iniciar sesión automáticamente
        if (resultado.token) {
          iniciarSesionContext(resultado.usuario, resultado.token)
          // Asegurarse de que el mensaje se muestre por un tiempo suficiente
          mostrarExito("¡Registro exitoso! Sesión iniciada automáticamente.", 5000)
          setTimeout(() => {
            navigate("/")
          }, 1000) // Esperar un momento antes de redirigir para que el usuario vea el mensaje
        } else {
          mostrarExito("¡Registro exitoso! Ahora puedes iniciar sesión.", 5000)
          setTimeout(() => {
            navigate("/login")
          }, 1000)
        }
      }
    } catch (error) {
      const mensajeError = error.message || "Error al registrar usuario. Por favor intenta nuevamente."
      establecerErrores({
        general: mensajeError,
      })
      mostrarError(mensajeError)
    } finally {
      establecerCargando(false)
    }
  }



  return (
    <AuthContainer mode="register">
      {/* Mensaje de error general */}
      {errores.general && (
        <div className="alerta-error mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm font-medium">{errores.general}</p>
        </div>
      )}

      {/* Formulario de registro */}
      <form onSubmit={manejarEnvio} className="formulario-registro space-y-5">
        <div className="space-y-4">
          <ModernInput
            type="text"
            name="username"
            value={datosFormulario.username}
            onChange={manejarCambio}
            placeholder="Nombre de usuario"
            icon="user"
            required
            error={errores.username}
          />

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
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ModernInput
            type="text"
            name="nombre"
            value={datosFormulario.nombre}
            onChange={manejarCambio}
            placeholder="Nombre"
            icon="user"
            error={errores.nombre}
          />
          
          <ModernInput
            type="text"
            name="apellido"
            value={datosFormulario.apellido}
            onChange={manejarCambio}
            placeholder="Apellido"
            icon="user"
            error={errores.apellido}
          />
        </div>

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

        {/* Indicador de fortaleza de contraseña */}
        {datosFormulario.password && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <p className="font-medium mb-1">Requisitos de contraseña:</p>
            <ul className="space-y-1">
              <li className={`flex items-center ${datosFormulario.password.length >= 8 ? 'text-green-600' : 'text-red-600'}`}>
                <i className={`fas ${datosFormulario.password.length >= 8 ? 'fa-check' : 'fa-times'} mr-1`}></i>
                Mínimo 8 caracteres
              </li>
              <li className={`flex items-center ${/[A-Z]/.test(datosFormulario.password) ? 'text-green-600' : 'text-red-600'}`}>
                <i className={`fas ${/[A-Z]/.test(datosFormulario.password) ? 'fa-check' : 'fa-times'} mr-1`}></i>
                Una letra mayúscula
              </li>
              <li className={`flex items-center ${/[a-z]/.test(datosFormulario.password) ? 'text-green-600' : 'text-red-600'}`}>
                <i className={`fas ${/[a-z]/.test(datosFormulario.password) ? 'fa-check' : 'fa-times'} mr-1`}></i>
                Una letra minúscula
              </li>
              <li className={`flex items-center ${/\d/.test(datosFormulario.password) ? 'text-green-600' : 'text-red-600'}`}>
                <i className={`fas ${/\d/.test(datosFormulario.password) ? 'fa-check' : 'fa-times'} mr-1`}></i>
                Un número
              </li>
            </ul>
          </div>
        )}

        <ModernButton
          type="submit"
          variant="primary"
          size="lg"
          loading={cargando}
          className="w-full"
        >
          {cargando ? "Registrando..." : "Registrarse"}
        </ModernButton>
      </form>
    </AuthContainer>
  )
}

export default Register
