
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
        default: "USER_ROLE"
        // enum: ['ADMIN_ROLE','USER_ROLE']
    },
    state:{
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    uid:{
        type: String,
    }
});


UserSchema.methods.toJSON = function() {
    const { __v, password, _id,...usuario} = this.toObject();
    usuario.uid = _id;
    // usuario. 
    // delete usuario.nombre;
    // this.uid = nombre._id;

    //RESPUESTA
    // usuario.uid = _id   sin declararlo en el Schema
    return usuario;

}


module.exports = model ( 'User', UserSchema );