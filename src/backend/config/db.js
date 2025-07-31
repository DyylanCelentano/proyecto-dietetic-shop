// config/db.js
const mongoose = require('mongoose');
const config = require('./config');

const conectarDB = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log('✅ Base de Datos conectada');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Detiene la app si no se puede conectar
    }
};

module.exports = conectarDB;