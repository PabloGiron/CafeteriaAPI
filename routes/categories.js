
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();
/**'
 * {{url}}/api/categories
 */
router.get('/', (req,res ) => {
    console.log('Todo ok!');
});

module.exports = router;

//Texto de prueba