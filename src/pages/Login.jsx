import { useNavigate } from "react-router-dom";
import AuthContainer from "../components/ui/AuthContainer";
import ModernButton from "../components/ui/ModernButton";
import ModernInput from "../components/ui/ModernInput";
import useFormularioAuth from "../hooks/useFormularioAuth";
import {
    autenticarConGoogle,
    iniciarSesion,
    validarFormularioLogin,
} from "../utils/validacionesAuth";

const Login = () => {
  const navigate = useNavigate();

  // Valores iniciales del formulario
  const valoresIniciales = {
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
  } = useFormularioAuth(valoresIniciales, validarFormularioLogin);


  const manejarEnvio = async (evento) => {
    evento.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    establecerCargando(true);

    try {
      const resultado = await iniciarSesion(datosFormulario);

      if (resultado.exito) {
        localStorage.setItem("usuario", JSON.stringify(resultado.usuario));
        localStorage.setItem("token", resultado.token);
        navigate("/");
      }
    } catch (error) {
      establecerErrores({
        general:
          error.message ||
          "Error al iniciar sesión. Por favor intenta nuevamente.",
      });
    } finally {
      establecerCargando(false);
    }
  };


  const manejarLoginGoogle = async () => {
    establecerCargando(true);

    try {
      const resultado = await autenticarConGoogle();

      if (resultado.exito) {
        localStorage.setItem("usuario", JSON.stringify(resultado.usuario));
        localStorage.setItem("token", resultado.token);
        navigate("/");
      }
    } catch (error) {
      establecerErrores({
        general:
          "Error al autenticar con Google. Por favor intenta nuevamente.",
      });
    } finally {
      establecerCargando(false);
    }
  };

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

        {/* Link de contraseña olvidada */}
        <div className="text-right">
          <a
            href="#"
            className="text-sm text-[#5E3B00] hover:text-[#815100] transition-colors font-['Gabarito']"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

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
  );
};

export default Login;
