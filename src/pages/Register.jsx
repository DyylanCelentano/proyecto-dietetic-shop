import { useNavigate } from "react-router-dom";
import AuthContainer from "../components/ui/AuthContainer";
import ModernButton from "../components/ui/ModernButton";
import ModernInput from "../components/ui/ModernInput";
import useFormularioAuth from "../hooks/useFormularioAuth";
import {
    autenticarConGoogle,
    registrarUsuario,
    validarFormularioRegistro,
} from "../utils/validacionesAuth";

const Register = () => {
  const navigate = useNavigate();

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
        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        navigate("/login");
      }
    } catch (error) {
      establecerErrores({
        general:
          error.message ||
          "Error al registrar usuario. Por favor intenta nuevamente.",
      });
    } finally {
      establecerCargando(false);
    }
  };


  const manejarRegistroGoogle = async () => {
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
          "Error al registrarse con Google. Por favor intenta nuevamente.",
      });
    } finally {
      establecerCargando(false);
    }
  };

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

        {/* Mensaje de validación */}
        <div className="mensaje-validacion text-xs text-[#5E3B00] bg-[#FFF8ED] border border-[#D3B178] p-3 rounded-lg font-['Gabarito']">
          Por favor completá este campo.
        </div>

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
