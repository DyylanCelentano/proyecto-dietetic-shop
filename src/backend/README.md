# Documentación Backend Dietetic-Shop

Sistema backend para e-commerce de productos dietéticos, construido con Node.js, Express y MongoDB.

## 📁 Estructura del Proyecto

```
backend/
├── server.js              # Punto de entrada principal
├── package.json            # Dependencias y scripts
├── .env                    # Variables de entorno
├── config/                 # Configuraciones
│   ├── config.js          # Configuración general
│   ├── db.js              # Conexión a MongoDB
│   └── cloudinary.js      # Configuración de Cloudinary
├── controllers/            # Lógica de negocio
│   ├── authController.js  # Autenticación y usuarios
│   ├── productoController.js # Gestión de productos
│   └── adminController.js # Panel administrativo
├── models/                 # Esquemas de MongoDB
│   ├── Usuario.js         # Modelo de usuarios
│   └── Producto.js        # Modelo de productos
├── middleware/             # Middlewares personalizados
│   └── authMiddleware.js  # Verificación de tokens
└── routes/                 # Definición de rutas
    ├── authRoutes.js      # Rutas de autenticación
    ├── productoRoutes.js  # Rutas de productos
    ├── adminRoutes.js     # Rutas del admin
    └── uploadRoutes.js    # Rutas para subida de archivos
```

## Archivos Principales

### `server.js`
Servidor principal de Express. Configura middlewares, rutas y maneja la conexión a la base de datos. Incluye health check y manejo de errores.

**Principales funciones:**
- Configuración de CORS para que el frontend pueda hacer peticiones
- Límites de 10MB para uploads de imágenes para evitar abusos
- Health check en `/health` para verificar el estado del servidor
- Carga automática de todas las rutas de la API

### `config/`

#### `config.js`
Centralizador de todas las variables de entorno. Lee del archivo `.env` y exporta configuración limpia.

Variables importantes:
- `PORT`: Puerto del servidor
- `MONGODB_URI`: URL de conexión a MongoDB
- `JWT_SECRET`: Clave secreta para tokens
- `CLOUDINARY_*`: Credenciales de Cloudinary

#### `db.js`
Maneja la conexión a MongoDB usando Mongoose. Incluye reconexión automática y manejo de errores.

#### `cloudinary.js`
Configuración para subida de imágenes a Cloudinary. Usado por el sistema de productos.

### `models/`

#### `Usuario.js`
Esquema y modelo de usuarios con validaciones:
- Campos: username, email, password, rol, activo
- Roles: 'usuario' y 'admin'. Por defecto es 'usuario'.
- Hash automático de passwords con bcrypt
- Validaciones de email único

#### `Producto.js`
Esquema y modelo de productos del catálogo:
- Información básica: nombre, descripción, precio, peso
- Categorización: categoria (enum), tags (array)
- Imagen: URL de Cloudinary
- Timestamps automáticos

### `controllers/`

#### `authController.js`
Maneja todo lo relacionado con autenticación:
- `registrarUsuario`: Registro de nuevos usuarios
- `loginUsuario`: Login con email/password
- `verificarToken`: Verificación de JWT válido
- Validaciones de campos y manejo de errores

#### `productoController.js`
CRUD completo de productos:
- `obtenerProductos`: Lista con filtros (categoría, tags)
- `obtenerProductoPorId`: Producto individual
- `crearProducto`: Crear nuevo (solo admin)
- `actualizarProducto`: Editar existente (solo admin)
- `eliminarProducto`: Borrar producto (solo admin)
- `obtenerCategorias`: Lista de categorías válidas
- `obtenerTags`: Lista de tags disponibles

#### `adminController.js`
Funciones específicas del panel administrativo:
- Estadísticas de ventas
- Métricas de usuarios
- Reportes y analytics

### `middleware/`

#### `authMiddleware.js`
Middleware de seguridad:
- `verificarToken`: Valida JWT en headers
- `esAdmin`: Verifica permisos de administrador
- Manejo de tokens expirados

### `routes/`

#### `authRoutes.js`
```
POST /api/auth/registro  # Crear cuenta nueva
POST /api/auth/login     # Iniciar sesión
GET  /api/auth/verificar # Verificar token actual antes de entrar al perfil
```

#### `productoRoutes.js`
```
GET    /api/productos           # Listar productos (público)
GET    /api/productos/categorias # Categorías disponibles
GET    /api/productos/tags      # Tags disponibles
GET    /api/productos/:id       # Producto específico
POST   /api/productos           # Crear producto (admin)
PUT    /api/productos/:id       # Editar producto (admin)
DELETE /api/productos/:id       # Eliminar producto (admin)
```

#### `adminRoutes.js`
```
GET /api/admin/estadisticas  # Métricas del dashboard
GET /api/admin/ventas        # Datos de ventas
```

#### `uploadRoutes.js`
```
POST /api/upload/imagen      # Subir imagen a Cloudinary
```

## Autenticación

El sistema usa JWT para autenticación:

1. Usuario se registra/loguea → Recibe token
2. Token se incluye en header: `Authorization: Bearer <token>`
3. Middleware verifica token en rutas protegidas
4. Acceso a funciones según rol (usuario/admin)

## Base de Datos

Usamos MongoDB con dos colecciones principales:

### Usuarios
- Almacena cuentas de usuarios y admins
- Passwords hasheados con bcryptjs
- Campos de timestamp automáticos

### Productos
- Catálogo completo de productos
- Categorías predefinidas (enum)
- Tags flexibles para filtrado
- Integración con Cloudinary para imágenes

## Manejo de Imágenes

Sistema integrado con Cloudinary:
- Upload directo desde el frontend
- Transformaciones automáticas
- URLs optimizadas para diferentes tamaños
- Almacenamiento en la nube

## Manejo de Errores

Cada endpoint incluye:
- Validación de entrada
- Try-catch para errores de BD
- Respuestas consistentes en formato JSON
- Códigos de estado HTTP apropiados

## Dependencias Principales

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **bcryptjs**: Hash de passwords
- **jsonwebtoken**: Manejo de tokens JWT
- **cloudinary**: Subida de imágenes
- **cors**: Headers para frontend
- **multer**: Upload de archivos

## Endpoints de Prueba

```bash
# Health check
GET http://localhost:5000/health

# Registrar usuario
POST http://localhost:5000/api/auth/registro
{
  "username": "test",
  "email": "test@test.com",
  "password": "123456"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "test@test.com",
  "password": "123456"
}

# Listar productos
GET http://localhost:5000/api/productos

# Filtrar por categoría
GET http://localhost:5000/api/productos?categoria=Frutos%20Secos

# Filtrar por tags
GET http://localhost:5000/api/productos?tags=Orgánico,Sin%20TACC
```

## Desarrollo

### Estructura de Respuestas
Todos los endpoints devuelven JSON:

```js
// Éxito
{
  "mensaje": "Operación exitosa",
  "data": { ... }
}

// Error
{
  "message": "Descripción del error",
  "error": "Detalles técnicos"
}
```

