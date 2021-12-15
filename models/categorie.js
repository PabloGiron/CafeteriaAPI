const { Schema, model } = require('mongoose');

const CategorieSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio.'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

CategorieSchema.methods.toJSON = function() {
    const { __v, state, ...data} = this.toObject();
    // usuario.uid = _id;
    return data;

}



module.exports = model ('Categorie', CategorieSchema);