// Configuración de variables de entorno
import dotenv from 'dotenv'
dotenv.config()

const config = {
  // Configuración de la base de datos
  mongoUri: process.env.MONGO_URI,
  
  // Clave secreta para JWT
  jwtSecret: process.env.JWT_SECRET,
  
  // Puerto del servidor
  port: process.env.PORT,
  
  // Configuración de CORS
  corsOrigin: process.env.CORS_ORIGIN,
  
  // Entorno
  nodeEnv: process.env.NODE_ENV
}

export default config