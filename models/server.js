const express = require('express')
const cors = require('cors')


class Server {
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';
        
        //Middlewares Es una funcion que siempre se ejecute?
        this.middleswares();
        //Rutas de la aplicación
        this.routes();
    }
    
    middleswares(){
        // CORS
        this.app.use(cors())
        // Reading and parse of body
        this.app.use(express.json());
        // Directorio público
        this.app.use( express.static('public') );

    }

    routes(){
        this.app.use( this.usersPath , require('../routes/user'))
    }

    listen(){
        
        this.app.listen( this.port , () => {
            console.log('Servidor corriendo en el puerto:', this.port);
        })
    }

}

module.exports = Server;