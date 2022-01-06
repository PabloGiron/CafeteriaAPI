const { Product } = require('../models');
const  Categorie  = require('../models/categorie');
const  Role  = require('../models/role');
const User = require('../models/user');

const validarRole = async (rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if (!existeRol) { 
        throw new Error(`El rol ${rol} no existe en la BD.`);
    }
}       

    //Verificar si el correo existe
    


const validarEmail = async (correo) => {
    // const {  nombre, correo, password, role } = req.body;
    // const user = new User({nombre, correo, password, role});
    const existeEmail = await User.findOne({correo});
    if( existeEmail ){
        // return res.status(400).json({
        //     msg: 'El correo ya está registrado.'
        // })
        throw new Error(`El correo ${correo} ya está registrado.`);
    }
}

const existeUsuarioPorId  = async ( id ) => {
    //console.log('Se ha recibido el id:', id)

    const usuarioExiste = await User.findById(id);
    // console.log('existeUsuario:', existeUsuario);
    if( !usuarioExiste ){
        throw new Error(`El id ${id} no existe.`);
    }
}

const existeCategoriaPorId = async (id) => {
    const categoriaExiste = await Categorie.findById(id);

    if( !categoriaExiste ){
        throw new Error(`El id ${id } no existe.`)
    }
}

const existeProductoPorId = async (id) => {
    const productoExiste = await Product.findById(id);

    if( !productoExiste ){
        throw new Error(`El producto con id ${id } no existe.`)
    }
}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones=[]) => {
    const incluida = colecciones.includes( coleccion );

    if(!incluida ){
        throw new Error(`La colección ${coleccion} no es permitida. - ${ colecciones }`)
    }
    return true;
}

module.exports = {
    validarRole,
    validarEmail,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}