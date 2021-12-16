const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            categories: '/api/categories',
            products:   '/api/products',
            search:     '/api/search',
            users:      '/api/users',
        }
        
        // this.usersPath = '/api/users';
        // this.authPath  = '/api/auth';
        
        //Conectar a la base de datos 
        this.connectDB();

        //Middlewares Es una funcion que siempre se ejecute?
        this.middleswares();
        //Rutas de la aplicación
        this.routes();
    }

    async connectDB(){
        await dbConnection(); 
    }
    
    middleswares(){
        // CORS
        this.app.use( cors() );
        // Reading and parse of body
        this.app.use(express.json());
        // Directorio público
        this.app.use( express.static('public') );

    }

    routes(){
        this.app.use( this.paths.auth , require('../routes/auth'))
        this.app.use( this.paths.categories , require('../routes/categories'))
        this.app.use( this.paths.products , require('../routes/products'));
        this.app.use( this.paths.search , require('../routes/search'))
        this.app.use( this.paths.users , require('../routes/user'))
    }

    listen(){
        
        this.app.listen( this.port , () => {
            console.log('Servidor corriendo en el puerto:', this.port);
        })
    }

}

module.exports = Server;