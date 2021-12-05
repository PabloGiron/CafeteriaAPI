const { response } = require("express")


const esAdminRole = (req, res = response, next) => {

    if(!req.usuarioAutenticado ){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const {role, nombre} = req.usuarioAutenticado;

    if (role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${ nombre }, no es administrador`
        })
    }



    next();

}

const tieneRole = ( ...roles ) =>{


    return (req, res = response, next) => {
        
        if(!req.usuarioAutenticado ){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            });
        }

        if (!roles.includes( req.usuarioAutenticado.role )){
            return res.status(401).json({
                msg: `Los roles permitidos son ${ roles }`
            });
        }

        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}