const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { User, Categorie, Product } = require ('../models')

const coleccionesPermitidas = [
    'users',
    'categories',
    'products',
    'roles',
    'products-categories'
];

const searchUsers = async (termino = '', res=response ) => {

    const esMongoId = ObjectId.isValid( termino.toString() ); // Si es un id de mongo devolverá true sino false

    if(esMongoId){
        const user = await User.findById(termino);
        return res.json({
            results: (user) ? [user] : []
        })
    }


    const regex = new RegExp( termino, 'i');

    const users = await User.find({ 
        $or: [
            { nombre: regex },
            { correo: regex }
        ],$and:[{ state:true }]
     });
    return res.json({
        results: users
    })
}

const searchCategories = async (termino = '', res=response ) => {

    const esMongoId = ObjectId.isValid( termino.toString() ); // Si es un id de mongo devolverá true sino false

    if(esMongoId){
        const category = await Categorie.findById(termino);
        return res.json({
            results: (category) ? [category] : []
        })
    }
    const Regex = new RegExp( termino, 'i');

    const categories = await Categorie.find({
        nombre: Regex,$and:[{ state:true }]
    })
    return res.json({
        results: categories
    })
}

const searchProducts = async(termino = '', res=response) => {
    const esMongoId = ObjectId.isValid( termino.toString() );
    if(esMongoId){
        const product = await Product.findById(termino).populate('category', 'nombre');
        return res.json({
            results: (product) ? [product] : []
        })
    }
    const regex = new RegExp( termino, 'i');
    const products = await Product.find({
        nombre: regex,$and:[{ state:true }]
    }).populate('category', 'nombre')
    return res.json({
        results: products
    })
}

const searchProductByCategory = async (termino = '', res = response) => {

    const esMongoId = ObjectId.isValid( termino );
    if(esMongoId){
        const product = await Product.find({
            category: ObjectId(termino)
        })
        return res.json({
            results: (product) ? [product] : []
        })
    }
}

const search = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}` 
        })
    }

    switch (coleccion) {

        case 'users':
            searchUsers(termino, res);
        break;
        case 'categories':
            searchCategories(termino, res);
        break;
        case 'products':
            searchProducts(termino, res);
        break;
        case 'products-categories':
            searchProductByCategory(termino,res);
        break;
        default:
            res.status(500).json({
                msg: 'La búsqueda por este término no existe.'
            })
    }
}

module.exports = { search }

