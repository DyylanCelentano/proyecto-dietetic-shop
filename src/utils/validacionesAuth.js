export const validarEmail = (email) => {
  const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patronEmail.test(email);
};


export const validarFormularioLogin = (datos) => {
  const errores = {};

  // Validar email
  if (!datos.email) {
    errores.email = "El email es obligatorio";
  } else if (!validarEmail(datos.email)) {
    errores.email = "Por favor ingresa un email válido";
  }

  // Validar contraseña
  if (!datos.password) {
    errores.password = "La contraseña es obligatoria";
  }

  return errores;
};


export const validarFormularioRegistro = (datos) => {
  const errores = {};

  // Validar username
  if (!datos.username?.trim()) {
    errores.username = "El nombre de usuario es obligatorio";
  } else if (datos.username.trim().length < 2) {
    errores.username = "El nombre de usuario debe tener al menos 2 caracteres";
  }

  // Validar email
  if (!datos.email) {
    errores.email = "El email es obligatorio";
  } else if (!validarEmail(datos.email)) {
    errores.email = "Por favor ingresa un email válido";
  }

  // Validar contraseña
  if (!datos.password) {
    errores.password = "La contraseña es obligatoria";
  }

  return errores;
};


export const iniciarSesion = async (credenciales) => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulación básica de autenticación
  if (
    credenciales.email === "admin@dietetic-shop.com" &&
    credenciales.password === "admin123"
  ) {
    return {
      exito: true,
      usuario: {
        id: 1,
        nombre: "Administrador",
        email: credenciales.email,
      },
      token: "token_simulado_123",
    };
  }

  throw new Error("Credenciales incorrectas");
};


export const registrarUsuario = async (datosUsuario) => {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simular verificación de email existente
  if (datosUsuario.email === "existente@ejemplo.com") {
    throw new Error("Este email ya está registrado");
  }

  return {
    exito: true,
    usuario: {
      id: Date.now(),
      username: datosUsuario.username,
      email: datosUsuario.email,
    },
    mensaje: "Usuario registrado exitosamente",
  };
};


export const autenticarConGoogle = async () => {
  // Simular delay de OAuth
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    exito: true,
    usuario: {
      id: Date.now(),
      nombre: "Usuario Google",
      email: "usuario@gmail.com",
    },
    token: "google_token_123",
  };
};
