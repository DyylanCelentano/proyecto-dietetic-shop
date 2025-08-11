import { useState } from "react"


const useFormularioAuth = (valoresIniciales, funcionValidacion) => {
  const [datosFormulario, setDatosFormulario] = useState(valoresIniciales)
  const [errores, setErrores] = useState({})
  const [cargando, setCargando] = useState(false)



  const manejarCambio = (evento) => {
    const { name, value } = evento.target

    setDatosFormulario((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value,
    }))

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errores[name]) {
      setErrores((erroresAnteriores) => ({
        ...erroresAnteriores,
        [name]: "",
      }))
    }
  }


  const validarCampo = (nombreCampo) => {
    if (funcionValidacion) {
      const erroresValidacion = funcionValidacion(datosFormulario)
      if (erroresValidacion[nombreCampo]) {
        setErrores((erroresAnteriores) => ({
          ...erroresAnteriores,
          [nombreCampo]: erroresValidacion[nombreCampo],
        }))
      }
    }
  }


  const validarFormulario = () => {
    if (funcionValidacion) {
      const erroresValidacion = funcionValidacion(datosFormulario)
      setErrores(erroresValidacion)
      return Object.keys(erroresValidacion).length === 0
    }
    return true
  }


  const resetearFormulario = () => {
    setDatosFormulario(valoresIniciales)
    setErrores({})
    setCargando(false)
  }


  const establecerCargando = (estado) => {
    setCargando(estado)
  }


  const establecerErrores = (nuevosErrores) => {
    setErrores(nuevosErrores)
  }

  return {
    datosFormulario,
    setDatosFormulario,
    errores,
    cargando,
    manejarCambio,
    validarCampo,
    validarFormulario,
    resetearFormulario,
    establecerCargando,
    establecerErrores,
  }
}

export default useFormularioAuth
