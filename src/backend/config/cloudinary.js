const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configura Cloudinary con las credenciales de tu archivo .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configura el almacenamiento para Multer
// Le decimos que guarde los archivos en una carpeta llamada 'Dietetic-Shop'
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Dietetic-Shop',
        allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
    },
});

module.exports = {
    cloudinary,
    storage,
};
