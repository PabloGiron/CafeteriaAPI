
const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/login', [
    check('correo','El correo es obligatorio').isEmail(),
    check('password','El password es obligatorio').notEmpty(),
    validarCampos
] , login  );


router.post('/google', [
    check('id_token','El id_token es necesario').notEmpty(),
    validarCampos
] , googleSignIn  );

module.exports = router;
