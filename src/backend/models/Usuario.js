const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
    trim: true,
    minlength: [2, 'El nombre de usuario debe tener al menos 2 caracteres'],
    maxlength: [30, 'El nombre de usuario no puede tener más de 30 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    validate: {
      validator: function(password) {
        // Validar que tenga al menos una letra mayúscula, una minúscula y un número
        const patronPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return patronPassword.test(password);
      },
      message: 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula y un número'
    }
  },
  rol: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// encriptar contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
  // Solo encriptar si la contraseña ha sido modificada
  if (!this.isModified('password')) return next();
  
  try {
    // Encriptar contraseña con salt de 12 rondas
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararPassword = async function(passwordCandidata) {
  return await bcrypt.compare(passwordCandidata, this.password);
};

// Método para obtener datos públicos del usuario (sin contraseña)
usuarioSchema.methods.toJSON = function() {
  const usuario = this.toObject();
  delete usuario.password;
  return usuario;
};

module.exports = mongoose.model('Usuario', usuarioSchema); 