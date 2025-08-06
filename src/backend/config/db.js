// config/db.js
import mongoose from 'mongoose';
import config from './config.js';

const conectarDB = async () => {
    try {
        console.log('Intentando conectar a MongoDB...');
        
        // configuración de conexión con timeout (para que no tarde tanto al conectar)
        const opciones = {
            serverSelectionTimeoutMS: 5000, // Timeout más largo para conexiones lentas
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4, // Usar IPv4, más rápido que IPv6
            maxPoolSize: 10, // Limitar pool de conexiones
            minPoolSize: 2,
            maxIdleTimeMS: 30000,
            bufferCommands: false, // Desactivar buffering de comandos
            retryWrites: true,
            w: 'majority'
        };

        const conexion = await mongoose.connect(config.mongoUri, opciones);
        
        console.log('✅ Base de Datos conectada exitosamente');
        console.log('Base de datos:', conexion.connection.name);
        
        // Manejo de eventos de conexión
        mongoose.connection.on('error', (err) => {
            console.error('❌ Error de MongoDB:', err.message);
            console.error('Detalles del error:', err);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB desconectado');
        });
        
        mongoose.connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconectado');
        });
        
        return conexion;
        
    } catch (error) {
        console.error('❌ Error de conexión a MongoDB:');
        console.error('Mensaje:', error.message);
        console.error('Código:', error.code);
        console.error('Nombre:', error.name);
        
        console.log('⚠️ Continuando sin base de datos...');
        return null;
    }
};

export default conectarDB;