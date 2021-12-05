const { response } = require("express");
const   bcrypt  = require("bcryptjs");

const User = require('../models/user');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res= response) =>{

    const { correo, password } = req.body;

    try {

        //verificar si mail existe
        const user = await User.findOne({ correo });
        if( !user) {
            return res.status(400).json({
                msg: 'Usuario / Passsword, no son correctos - mail'
            })
        }

        //Verificar si el usuario está activo
        if( !user.state) {
            return res.status(400).json({
                msg: 'Usuario / Passsword, no son correctos - state'
            })
        }
        //Verificar la contraseña
        const validPassword = bcrypt.compareSync(password, user.password);
        if( !validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Passsword, no son correctos - password'
            })
        }

        //Generar JWT
        const token = await generarJWT(user.id);


        res.json({
            msg: 'login ok',
            user,
            token
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Comuniquese con el administrador',
        })
    }
}

module.exports = {
    login
}