
const { Router } = require('express');
const { check, body } = require('express-validator');
const { usersGet, usersPut, usersPost, usersDelete, usersPatch } = require('../controllers/user');
const { validarRole, validarEmail, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', usersGet );

router.put('/:id',[
    check('id','El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('role').custom(validarRole),
    validarCampos,
] ,usersPut );

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(validarEmail),
    // check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),`
    check('role').custom(validarRole),
    validarCampos
    ],usersPost);

router.delete('/:id', [
    check('id','El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
] , usersDelete);

router.patch('/',usersPatch)


module.exports = router; 