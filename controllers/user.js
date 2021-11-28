const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');


const usersGet = (req, res = response ) => {
    
    const { q, nombre='No name', apikey, page = 1, limit} = req.query;

    res.json({
        msg: "get API - Controller",
        q,
        nombre,
        apikey,
        page,
        limit
    }) 
}

const usersPost = async (req, res = response ) => {

    const {  nombre, correo, password, role } = req.body;
    const body = req.body;
    const user = new User({nombre, correo, password, role});

    //Verificar si el correo existe
    const existeEmail = await User.findOne({correo});
    if( existeEmail ){
        return res.status(400).json({
            msg: 'El correo ya está registrado.'
        })
    }

    //Encriptar contraseña 
    const salt = bcryptjs.genSaltSync(10);
    user.password = bcryptjs.hashSync( password, salt );
    //Guardar usuario en la BD
    await user.save();

    
    res.json({
        // msg: "post API - Controller",
        user
    })
}

const usersPut = (req, res = response ) => {
    
    const id =  req.params.id;
    // const { id } = req.params;

    res.json({
        msg: "put API - Controller",
        id
    })
}

const usersPatch = (req, res = response ) => {
    
    res.json({
        msg: "patch API - Controller"
    })
}

const usersDelete = (req, res = response ) => {
    
    res.json({
        msg: "delete API - Controller"
    })
}

module.exports = {
    usersGet,
    usersDelete,
    usersPost,
    usersPut,
    usersPatch
}