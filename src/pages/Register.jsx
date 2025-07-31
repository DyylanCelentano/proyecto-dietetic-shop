import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import useToast from "../hooks/useToast.jsx";
import AuthContainer from "../components/ui/AuthContainer";
import ModernButton from "../components/ui/ModernButton";
import ModernInput from "../components/ui/ModernInput";
import useFormularioAuth from "../hooks/useFormularioAuth";
import {
    registrarUsuario,
    validarFormularioRegistro,
} from "../utils/validacionesAuth";

const Register = () => {
  const navigate = useNavigate();
  const { iniciarSesion: iniciarSesionContext } = useAuth();
  const { mostrarExito, mostrarError } = useToast();

  // Valores iniciales del formulario
  const valoresIniciales = {
    username: "",
    email: "",
    password: "",
  };

  // Hook personalizado para manejar el formulario
  const {
    datosFormulario,
    errores,
    cargando,
    manejarCambio,
    validarFormulario,
    establecerCargando,
    establecerErrores,
  } = useFormularioAuth(valoresIniciales, validarFormularioRegistro);


  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    establecerCargando(true);

    try {
      const resultado = await registrarUsuario(datosFormulario);

      if (resultado.exito) {
        // Si el registro incluye un token, iniciar sesión automáticamente
        if (resultado.token) {
          iniciarSesionContext(resultado.usuario, resultado.token);
          mostrarExito("¡Registro exitoso! Sesión iniciada automáticamente.");
          navigate("/");
        } else {
          mostrarExito("¡Registro exitoso! Ahora puedes iniciar sesión.");
          navigate("/login");
        }
      }
    } catch (error) {
      const mensajeError = error.message || "Error al registrar usuario. Por favor intenta nuevamente.";
      establecerErrores({
        general: mensajeError,
      });
      mostrarError(mensajeError);
    } finally {
      establecerCargando(false);
    }
  };


// Función eliminada - no se requiere autenticación con Google

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
  );
};

export default Register;
