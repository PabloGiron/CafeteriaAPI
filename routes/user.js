
const { Router } = require('express');
const { check, body } = require('express-validator');
const  Role  = require('../models/role');
const { usersGet, usersPut, usersPost, usersDelete, usersPatch } = require('../controllers/user');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', usersGet );

router.put('/:id', usersPut );

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // check('name', 'El nombre es obligatorio').notEmpty(),
    // body('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es valido').isEmail(),
    // check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),`
    check('role').custom( async (rol = '') => {
        const existeRol = await Role.findOne({ rol });
        if (!existeRol) { 
            throw new Error(`El rol ${rol} no existe en la BD.`);
        }
    }),
    validarCampos
    ],usersPost);

router.delete('/', usersDelete);

router.patch('/',usersPatch)


module.exports = router; 