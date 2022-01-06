const path = require('path');
const fs = require ('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL  );

const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { User, Product } = require ('../models')


const cargarArchivo = async (req, res = response) => {
      
    // console.log(req.files);

    try {
        //Imagenes
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre })
        
    } catch (msg) {
        res.status(400).json({
            msg
        })
    }

}

const actualizarImagen = async (req, res = response) => {

    const {id , coleccion} = req.params;

    let modelo;
    
    // await validarArchivo(req, res);
    // console.log(`id: ${id}, coleccion: ${coleccion}`)


    switch ( coleccion ){
        case 'usuarios':
            modelo = await User.findById(id);

            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${ id }`
                })
            }
        break;
        // case ''
        case 'productos':
                modelo = await Product.findById(id);

                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un producto con el id: ${ id }`
                    })
                }
        break;

        default:
            return res.status(500).json({msg: 'Validación inexistente en la base de datos.'})
    }

    //Limpiar las imágenes previas
    if (modelo.img){
        //Si existe se borrará la imagen del servidor 
        const pathImg = path.join(__dirname,'../uploads', coleccion, modelo.img);
        if ( fs.existsSync( pathImg ) ){
            fs.unlinkSync( pathImg );
        }
    }



    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save(); 


    res.json( modelo );
}


const actualizarImagenCloudinary = async (req, res = response) => {

    const {id , coleccion} = req.params;

    let modelo;
    
    switch ( coleccion ){
        case 'usuarios':
            modelo = await User.findById(id);

            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${ id }`
                })
            }
        break;
        // case ''
        case 'productos':
                modelo = await Product.findById(id);

                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un producto con el id: ${ id }`
                    })
                }
        break;

        default:
            return res.status(500).json({msg: 'Validación inexistente en la base de datos.'})
    }

    //Limpiar las imágenes previas
    if (modelo.img){
    
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);

    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    modelo.img = secure_url;
    await modelo.save(); 


    res.json( modelo );
}

const mostrarImagen = async (req, res= response) => {

    
    const {id , coleccion} = req.params;

    let modelo;

    switch ( coleccion ){
        case 'usuarios':
            modelo = await User.findById(id);

            if( !modelo ){
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${ id }`
                })
            }
        break;
        // case ''
        case 'productos':
                modelo = await Product.findById(id);

                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un producto con el id: ${ id }`
                    })
                }
        break;

        default:
            return res.status(500).json({msg: 'Validación inexistente en la base de datos.'})
    }

    //Limpiar las imágenes previas
    if (modelo.img){
        //Si existe se enviará la imagen del servidor 
        const pathImg = path.join(__dirname,'../uploads', coleccion, modelo.img);
        if ( fs.existsSync( pathImg ) ){

            return res.sendFile(pathImg);

        }
    }

    const pathNoImg = path.join(__dirname,'../assets/no-image.jpg');
    return res.sendFile(pathNoImg);
    res.json({
        msg: 'No se envió place holder'
    })

}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
};