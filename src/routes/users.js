// ************ Require's ************
const express = require('express');
const router = express.Router();
const usersController = require("../controllers/usersController")


//------------------ VALIDACIONES -----------------
const { body } = require('express-validator');

const validacionDeFormulario = [
    body("name").notEmpty().withMessage("Completa tu Nombre").bail()
        .isLength({ min: 3, max: 12}).withMessage("Ingrese un nombre como minino de 3 caracteres").bail(),

    body("lastname").notEmpty().withMessage("Completa tu Apellido").bail()
        .isLength({ min: 3, max : 12}).withMessage("Ingrese un apellido como minino de 3 caracteres").bail(),

    body("email").notEmpty().withMessage("Completa tu E-mail").bail()
        .isLength({ min: 3 , max: 12}).withMessage("Debe ingresar un email válido").bail(),
]
router.get('/register', usersController.register);

router.post('/register', validacionDeFormulario, usersController.userCreate);


module.exports = router;