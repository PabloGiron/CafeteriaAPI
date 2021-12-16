const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
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
    },
    precio:{
        type: Number,
        default: 0,
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Categorie',
        required: true
    },
    desc:{ type: String},
    disponible: { type: Boolean, default: true}
});

ProductSchema.methods.toJSON = function() {
    const { __v, state, ...data} = this.toObject();
    return data;

}



module.exports = model ('Product', ProductSchema);