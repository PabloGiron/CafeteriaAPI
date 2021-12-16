const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, tieneRole } = require('../middlewares');
const { productPost, productsGet, productGet, productPut, productDelete } = require('../controllers/products');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');



const router = Router();
/**'
 * {{url}}/api/products
 */

// Ver todos los productos - Público
router.get('/', productsGet);

// Obtener producto en específico - Público
router.get('/:id', [
    check('id','El id no es válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], productGet)

//Crear producto - privado
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('category','La categoría es obligatoria').notEmpty(),
    check('category','No es un id válido').isMongoId(),
    check('category').custom(existeCategoriaPorId),
    validarCampos
], productPost)

//Actualizar un producto con un token válido - Cualquier rol
router.put('/:id',[
    validarJWT,
    // check('nombre','El nombre es obligatorio').notEmpty(),
    check('id','El id no es válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('category','No es un id válido').isMongoId(),
    check('category').custom(existeCategoriaPorId),
    validarCampos
], productPut)

//Borrar un producto (solo si tiene el rol administrador)
router.delete('/:id',[
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id','El id no es válido.').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],productDelete)

module.exports = router;