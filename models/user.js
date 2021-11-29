
const { Schema, model } = require('mongoose');

const UserSchema = Schema ({
    nombre:{
        type: String,
        required: [true,'El nombre es obligatorio.']
    },
    correo: {
        type: String,
        require: [true, 'El correo es obligatorio.'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'La constraseña es obligatoria.'],
    },
    img: {
        type: String
    },
    role:{
        type: String,
        require: true,
        // enum: ['ADMIN_ROLE','USER_ROLE']
    },
    state:{
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

UserSchema.methods.toJSON = function() {
    const { __v, password, ...usuario  } = this.toObject();
    return usuario;
}


module.exports = model ( 'User', UserSchema );