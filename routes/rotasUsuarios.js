const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.post("/usuario", usuarioController.createUsuario);
//router.post("/auth", usuarioController.login);
router.get("/usuario", usuarioController.getAllUsuarios);
router.put("/usuario/:id", usuarioController.updateUsuario);
router.delete("/usuario/:id", usuarioController.deleteUsuario);

module.exports = router;
