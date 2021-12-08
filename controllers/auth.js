const { response } = require("express");
const   bcrypt  = require("bcryptjs");

const User = require('../models/user');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async ( req, res=response ) => {

    const {id_token} = req.body;

    const { correo, nombre, img } = await googleVerify( id_token );
    // console.log (googleUser);

    let usuario = await User.findOne({ correo });
    if(!usuario){
        //Crear usuario en caso de que no exista.
        const data =  {
            nombre,
            correo,
            password: ':D',
            img,
            google: true
        };
        usuario = new User (data);
        await usuario.save();
    }

    // Si el usuario es state = False
    if (!usuario.state ){
        return res.status(401).json({
            msg: 'Comuniquese con su administrador - Usuario bloqueado.'
        })
    }

    // Generar JWT
    const token = await generarJWT(usuario.id);
    res.json({
        usuario,
        token
    })


    try {

        res.json({
            msg: 'Todo ok - Google sign in',
        })
        
    } catch (error) {
        res.status(400).json({
            msg: "Token de Google no es válido"
        })
    }



}

module.exports = {
    login,
    googleSignIn
}