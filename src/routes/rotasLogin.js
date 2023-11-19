const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const usuarioController = require("../controllers/usuarioController");

router.post("/", loginController.login);
router.post("/registrar", usuarioController.createUsuario);
router.post("/verificartoken", loginController.verifyToken)

module.exports = router;
