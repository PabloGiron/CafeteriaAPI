const jwt = require('jsonwebtoken');

const { response } = require('express');

const User = require('../models/user');

const validarJWT = async (req = request, res = response, next) =>{

    const token = req.header('u-token');
    // console.log( token );
    if (!token){
        return res.status(401).json({
            msg: 'No se envió ningún token.'
        })
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        
        // Leer usuario que correponde al uid
        req.uid = uid;
        // req.usuarioAutenticado = await User.findById(uid);
        const usuarioAutenticado = await User.findById(uid);
        req.usuarioAutenticado = usuarioAutenticado;

        // Verificar si el uid tiene state true

        if( !usuarioAutenticado ){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe'
            })
        }

        if (!usuarioAutenticado.state ){
            return res.status(401).json({
                msg: 'Token no valido - usuario eliminado'
            })
        }
        
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido.'
        })
    }
}

module.exports = {
    validarJWT
}
