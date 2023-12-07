const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.get("/", usuarioController.getUsuarioById);
router.post("/", usuarioController.createUsuario);
router.put("/", usuarioController.updateUsuario);
router.patch("/", usuarioController.patchUsuario);
router.delete("/", usuarioController.deleteUsuario);

module.exports = router;
