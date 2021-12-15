
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, tieneRole } = require('../middlewares');
const { createCategorie, categoriesGet, categoryGet, categoryPut, categoryDelete } = require('../controllers/categories');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();
/**'
 * {{url}}/api/categories
 */

// Obtener todas las categoarias - Público
router.get('/', categoriesGet);

// Obtener una categoría por id - Público
router.get('/:id', [
    check('id','El id no es válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
] ,categoryGet);

// Crear categoría - Privado con cualquier rol
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio.').notEmpty(),
    validarCampos
],createCategorie);
 
// Actualizar id - cualquiera con token válido 
router.put('/:id',[ 
    validarJWT,
    check('nombre','El nombre es obligatorio').notEmpty(),
    check('id','El id no es válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],categoryPut);

// Borrar una categoría - Solo si es administrador
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id','El id no es válido.').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],categoryDelete);


module.exports = router;