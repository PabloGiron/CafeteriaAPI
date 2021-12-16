const { response } = require('express');
const { Product, Categorie }  = require("../models");


//Obtener todos los productos
const productsGet = async (req, res = response) =>{

    const { limit = 5, from = 0 } = req.query;
    const query = {state: true};

    const [total, product] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .skip( Number(from) )
            .limit( Number(limit))
            .populate('category','nombre')
            .populate('user','nombre'),
            // .populate('user', 'nombre')
            // .populate('categorie','nombre')
        ]);

    res.json({
        total,
        product
        // resps
    }) ;
}

//Obtener producto por id
const productGet = async (req,res=response) => {
    const { id } = req.params;
    const product = await Product.findById(id)
                                 .populate('category','nombre')
                                 .populate('user','nombre');
    res.json({
        product
    })
}

//Crear un producto
const productPost = async (req,res=response) => {

    let {nombre, precio, desc, category} = req.body
    nombre = nombre.toUpperCase();

    const productDB = await Product.findOne({nombre});
    if(productDB){
        return res.status(400).json({
            msg: `El producto ${productDB.nombre} ya existe.`
        })
    }

    
    const data = {
        nombre,
        precio,
        desc,
        category,
        user: req.usuarioAutenticado._id,
    }
    const product = new Product(data);

    //Guardar en la DB
    await product.save();
    //Se devuelve código con éxito
    res.status(201).json(product);
}

//Actualizar producto
const productPut = async(req,res=response) => {
    const { id } = req.params;
    const { _id, state, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    data.user = req.usuarioAutenticado._id;

    const nombre =  req.body.nombre.toUpperCase();
    // const productDB = await Categorie.findOne({nombre})
    const productDB = await Product.findOne({nombre});
    if(productDB){
        return res.status(400).json({
            msg: `El producto ${productDB.nombre} ya existe.`
        })
    }
    const product = await Product.findByIdAndUpdate(id, data,{new: true})
                        .populate('category','nombre')
                        .populate('user','nombre');
    res.json({
        product
    })
}

//Borrar producto
const productDelete = async (req, res=response) => {

    const {id} = req.params;
    const usuarioAutenticado = req.usuarioAutenticado
    

    const category = await Product.findByIdAndUpdate( id, {state: false}, {new:true}).populate('category','nombre')
    .populate('user','nombre');
    res.json({
        category,
        usuarioAutenticado
    })

}
module.exports = {
    productPost,
    productsGet,
    productGet,
    productPut,
    productDelete
}