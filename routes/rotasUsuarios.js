const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const usuarioController = require("../controllers/usuarioController");

router.post("/auth", usuarioController.login);
router.get("/usuarios", usuarioController.getAllUsuarios);
router.post("/usuario", usuarioController.createUsuario);
router.put("/usuario/:id", usuarioController.updateUsuario);
router.delete("/usuario/:id", usuarioController.deleteUsuario);

module.exports = router;
