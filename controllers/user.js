const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');


const usersGet = async (req, res = response ) => {
    
    // const { q, nombre='No name', apikey, page = 1, limit} = req.query;
    const { limit = 5, from = 0 } = req.query;
    const query = {state: true};

    // const users =  await User.find(query)
    //     .skip( Number(from) )
    //     .limit( Number(limit));

    // const total = await User.countDocuments(query);

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip( Number(from) )
            .limit( Number(limit))
    ]);

   // const total = await User.countDocuments();

    res.json({
        total,
        users
        // resps
    }) ;
}

const usersPost = async (req, res = response ) => {

    const {  nombre, correo, password, role } = req.body;
    // const body = req.body;
    const user = new User({nombre, correo, password, role});


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

const usersPut = async (req, res = response ) => {
    
    // const id =  req.params.id;
    const { id } = req.params;
    const {_id ,password, google, correo, ...resto} = req.body;

    //TODO validar que el id exista en la BD
    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }
    
    const usuario = await User.findByIdAndUpdate( id, resto );

    res.json({
        // msg: "put API - Controller",
        usuario
    })
}

const usersPatch = (req, res = response ) => {
    
    res.json({
        msg: "patch API - Controller"
    })
}

const usersDelete = async (req, res = response ) => {
    
    const {id} = req.params;

    const uid = req.uid;
    //TODO: usuarioAutenticado 
    const usuarioAutenticado = req.usuarioAutenticado
    const user = await User.findByIdAndUpdate( id, {state: false} );
    res.json({user, usuarioAutenticado });
    // msg: "delete API - Controller")
    // Físicamente eliminar el registro de la BD
    // const user = await User.findByIdAndDelete( id );
}

module.exports = {
    usersGet,
    usersDelete,
    usersPost,
    usersPut,
    usersPatch
}