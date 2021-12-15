const{ response } = require('express');
const{ Categorie } = require('../models')

//Obtener categorias - Paginado - total - populate
const categoriesGet = async (req,res = response) => {
    
    const { limit = 5, from = 0 } = req.query;
    const query = {state: true};

    const [total, categories] = await Promise.all([
        Categorie.countDocuments(query),
        Categorie.find(query)
            .skip( Number(from) )
            .limit( Number(limit))
            // .populate('user'),
            .populate('user', 'nombre')
        ]);

    // Categorie.populate(req.category._id)
    
    res.json({
        total,
        cateogories: categories
        // resps
    }) ;
}

//Obtener categoria - populate {} solo regresará el objeto de la categoría
const categoryGet = async (req, res = response) => {

    const { id } = req.params;
    const category = await Categorie.findById(id)
                            .populate('user', ['nombre']);
    // category.populate('user', );
    res.json({
        category
    })

}

const createCategorie = async (req, res= response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoryDB = await Categorie.findOne({ nombre });

    if( categoryDB ){
        return res.status(400).json({
            msg: `La categoria ${categoryDB.nombre} ya existe`
        })
    }

    //Generar la data que se guardará
    const data = {
        nombre,
        user: req.usuarioAutenticado._id
    }

    // console.log('La data:');
    // console.log(data);

    const category = new Categorie(data);

    //Guardar DB
    await category.save();

    res.status(201).json(category);

}

//Actualizar categoria (solo se recibe el nombre)
const categoryPut = async (req, res= response) => {
    const { id } = req.params;
    const { _id, state, user, ...resto} = req.body;
    resto.nombre = resto.nombre.toUpperCase();
    resto.user    = req.usuarioAutenticado._id;

    const nombre =  req.body.nombre.toUpperCase();
    const categoryDB = await Categorie.findOne( { nombre } );

    if( categoryDB ){
        return res.status(400).json({
            msg: `La categoria ${categoryDB.nombre} ya existe`
        })
    }
    //Generar la data que se guardará
    resto.nombre = nombre;
    //Actualizar el registro por nombre
    const category = await Categorie.findByIdAndUpdate(id, resto, {new:true});

    res.json({
        category
    })
}

//Borrar categoria - estado: false
const categoryDelete = async(req,res=response)=> {
    const {id} = req.params;
    const usuarioAutenticado = req.usuarioAutenticado
    

    const category = await Categorie.findByIdAndUpdate( id, {state: false}, {new:true});
    res.json({
        category,
        usuarioAutenticado
    })

}




module.exports = {
    createCategorie,
    categoriesGet,
    categoryGet,
    categoryPut,
    categoryDelete

}