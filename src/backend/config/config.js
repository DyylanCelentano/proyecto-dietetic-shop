// Configuración de variables de entorno
require('dotenv').config();

const config = {
  // Configuración de la base de datos
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/dietetic-shop',
  
  // Clave secreta para JWT
  jwtSecret: process.env.JWT_SECRET || 'clave_secreta_por_defecto_cambiar_en_produccion',
  
  // Puerto del servidor
  port: process.env.PORT || 5000,
  
  // Configuración de CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Entorno
  nodeEnv: process.env.NODE_ENV || 'development'
};

module.exports = config; 