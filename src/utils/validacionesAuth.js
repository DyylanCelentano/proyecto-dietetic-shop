export const validarEmail = (email) => {
  const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return patronEmail.test(email)
}

export const validarPassword = (password) => {
  // Mínimo 8 caracteres, al menos una letra mayúscula, una minúscula y un número
  const patronPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return patronPassword.test(password)
}


export const validarFormularioLogin = (datos) => {
  const errores = {}

  // Validar email
  if (!datos.email) {
    errores.email = "El email es obligatorio"
  } else if (!validarEmail(datos.email)) {
    errores.email = "Por favor ingresa un email válido"
  }

  // Validar contraseña
  if (!datos.password) {
    errores.password = "La contraseña es obligatoria"
  } else if (datos.password.length < 8) {
    errores.password = "La contraseña debe tener al menos 8 caracteres"
  }

  return errores
}


export const validarFormularioRegistro = (datos) => {
  const errores = {}

  // Validar username
  if (!datos.username?.trim()) {
    errores.username = "El nombre de usuario es obligatorio"
  } else if (datos.username.trim().length < 2) {
    errores.username = "El nombre de usuario debe tener al menos 2 caracteres"
  } else if (datos.username.trim().length > 30) {
    errores.username = "El nombre de usuario no puede tener más de 30 caracteres"
  }

  // Validar email
  if (!datos.email) {
    errores.email = "El email es obligatorio"
  } else if (!validarEmail(datos.email)) {
    errores.email = "Por favor ingresa un email válido"
  }

  // Validar contraseña
  if (!datos.password) {
    errores.password = "La contraseña es obligatoria"
  } else if (!validarPassword(datos.password)) {
    errores.password = "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula y un número"
  }

  return errores
}


export const iniciarSesion = async (credenciales) => {
  try {
    const respuesta = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credenciales),
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'Error al iniciar sesión')
    }

    return {
      exito: true,
      usuario: datos.usuario,
      token: datos.token,
    }
  } catch (error) {
    console.error('Error en iniciarSesion:', error)
    throw new Error(error.message || 'Error de conexión')
  }
}


export const registrarUsuario = async (datosUsuario) => {
  try {
    const respuesta = await fetch('http://localhost:5000/api/auth/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosUsuario),
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || 'Error al registrar usuario')
    }

    return {
      exito: true,
      usuario: datos.usuario,
      mensaje: datos.mensaje,
    }
  } catch (error) {
    console.error('Error en registrarUsuario:', error)
    throw new Error(error.message || 'Error de conexión')
  }
}


// Función eliminada - no se requiere autenticación con Google
