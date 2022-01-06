const { response } = require("express")
const { MAX_ACCESS_BOUNDARY_RULES_COUNT } = require("google-auth-library/build/src/auth/downscopedclient")


const validarArchivoSubir = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json({msg: 'No hay archivos en la peticion. - func(ValidarArchivoSubir)'});
    }
    next();
}

module.exports = {
    validarArchivoSubir
}