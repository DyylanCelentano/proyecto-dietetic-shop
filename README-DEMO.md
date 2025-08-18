Necesito implementar un "modo demo" en mi aplicación backend para mostrar una versión demostrativa en LinkedIn. El modo demo debe interceptar operaciones de escritura (POST, PUT, DELETE) y simularlas sin realizar cambios reales en la base de datos MongoDB Atlas.

Por favor, implementa los siguientes cambios:

1. Crear un nuevo archivo `middleware/demoMiddleware.js` con el siguiente código:
```javascript
// middleware/demoMiddleware.js
import config from '../config/config.js';

/**
 * Middleware que detecta si la aplicación está en modo demo y 
 * simula operaciones de escritura en la base de datos.
 */
const demoMiddleware = (req, res, next) => {
  // Verifica si estamos en modo demo
  if (config.isDemoMode === 'true') {
    // Si es una operación de escritura (POST, PUT, DELETE)
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      console.log('🧪 MODO DEMO: Simulando operación', req.method, 'en', req.originalUrl);

      // Para operaciones de creación (POST), devuelve un objeto simulado con ID ficticio
      if (req.method === 'POST') {
        // Genera un ID falso pero con formato correcto para MongoDB (24 caracteres hexadecimales)
        const fakeId = Array(24).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        
        return res.status(201).json({
          mensaje: 'Operación simulada en modo demo (no afecta la base de datos real)',
          demo: true,
          data: { 
            ...req.body, 
            _id: fakeId,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
      }
      
      // Para operaciones de actualización (PUT, PATCH)
      if (req.method === 'PUT' || req.method === 'PATCH') {
        return res.status(200).json({
          mensaje: 'Operación simulada en modo demo (no afecta la base de datos real)',
          demo: true,
          data: { 
            ...req.body, 
            _id: req.params.id,
            updatedAt: new Date()
          }
        });
      }
      
      // Para operaciones de eliminación (DELETE)
      if (req.method === 'DELETE') {
        return res.status(200).json({
          mensaje: 'Operación simulada en modo demo (no afecta la base de datos real)',
          demo: true
        });
      }
    }
  }

  // Si no estamos en modo demo o es una operación de lectura, continúa con normalidad
  next();
};

export default demoMiddleware;
```

2. Modificar `config/config.js` para añadir la propiedad isDemoMode. Añade esta línea al objeto config:
```javascript
// Modo demo - cuando está en "true", simula operaciones de escritura sin afectar la base de datos
isDemoMode: process.env.DEMO_MODE || 'false'
```

3. Modificar el archivo principal del servidor (server.js o index.js o app.js) para importar y usar el middleware:
```javascript
// Importar el middleware de modo demo
import demoMiddleware from './middleware/demoMiddleware.js';

// [...]

// Aplicar middleware de modo demo si está habilitado
if (config.isDemoMode === 'true') {
  console.log('🧪 MODO DEMO ACTIVADO: Las operaciones de escritura serán simuladas');
  app.use(demoMiddleware);
}

// [Aquí van tus rutas/middlewares existentes]
```

4. Añadir una ruta para verificar el estado del modo demo:
```javascript
// Ruta para verificar modo demo
app.get('/demo-status', (req, res) => {
  res.json({ 
    demoMode: config.isDemoMode === 'true',
    message: config.isDemoMode === 'true' 
      ? 'Modo demostración activo: Las operaciones de escritura no afectarán la base de datos'
      : 'Modo normal: Las operaciones de escritura afectarán la base de datos'
  });
});
```

5. Modificar la ruta /health si existe, o crearla si no existe:
```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor funcionando correctamente',
    demoMode: config.isDemoMode === 'true' ? 'Activo' : 'Inactivo',
    timestamp: new Date().toISOString()
  });
});
```

Por favor implementa estos cambios manteniendo el estilo y estructura actual de mi código. Después de implementar estos cambios, necesitaré añadir la variable de entorno DEMO_MODE=true en mi configuración de Railway.

6. Crear una ruta especial para auto-login en modo demo (añadir esto en las rutas de autenticación):

```javascript
// Ruta para auto-login en modo demo
app.post('/api/auth/demo-login', async (req, res) => {
  try {
    // Solo funciona si estamos en modo demo
    if (config.isDemoMode !== 'true') {
      return res.status(403).json({ 
        mensaje: 'Auto-login solo disponible en modo demo' 
      });
    }

    // Buscar el usuario administrador demo en la base de datos
    // Usar el email del usuario admin que existe en la base de datos
    const usuarioDemo = await Usuario.findOne({ 
      email: 'admin@gmail.com',
      rol: 'admin' 
    });

    if (!usuarioDemo) {
      return res.status(404).json({ 
        mensaje: 'Usuario demo no encontrado. Asegúrate de tener una cuenta admin con email demo@admin.com' 
      });
    }

    // Generar token JWT para el usuario demo
    const token = jwt.sign(
      { 
        id: usuarioDemo._id,
        email: usuarioDemo.email,
        rol: usuarioDemo.rol 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('🧪 MODO DEMO: Auto-login realizado para usuario admin');

    res.json({
      mensaje: 'Auto-login demo exitoso',
      demo: true,
      token,
      usuario: {
        id: usuarioDemo._id,
        nombre: usuarioDemo.nombre,
        email: usuarioDemo.email,
        rol: usuarioDemo.rol
      }
    });

  } catch (error) {
    console.error('Error en auto-login demo:', error);
    res.status(500).json({ 
      mensaje: 'Error interno del servidor en auto-login demo' 
    });
  }
});
```

IMPORTANTE: Antes de implementar esto, asegúrate de tener en tu base de datos MongoDB Atlas un usuario con:
- email: 'admin@gmail.com' (que ya tienes en tu base de datos)
- rol: 'admin'  
- contraseña: cualquiera (no se usará en el auto-login)

También necesitarás importar el modelo Usuario y jwt en la parte superior del archivo donde implementes esta ruta.
