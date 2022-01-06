const path = require('path')
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas=['png','jpg','jpeg','gif'], carpeta = '') => {

    return new Promise ((resolve, reject) => {
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const { archivo }  = files;
        const nombre = archivo.name.split('.');
        const extension = nombre[ nombre.length - 1 ];
    
    
        if( !extensionesValidas.includes( extension ) ){
            return reject(`La extension ${extension} no es válida. Se permiten: ${extensionesValidas}`)
        }
        const nombreTemp = uuidv4() + '.' + extension;
        uploadPath = path.join(__dirname , '../uploads/', carpeta , nombreTemp);
    
        // Use the mv() method to place the file somewhere on your server
        archivo.mv(uploadPath, function(err) {
        if (err){
            reject(err);
        }
        
        resolve(nombreTemp);
        
        // res.json({msg: 'File uploaded to:'+ uploadPath});
        });
    })

}


module.exports = {
    subirArchivo
}