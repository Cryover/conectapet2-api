const express = require("express");
const router = express.Router();
const consulta = require("../controllers/consultaController");

router.get("/", consulta.getAllConsulta);
router.get("/:id"), consulta.getConsultaByIdPet;
router.post("/", consulta.createConsulta);
router.put("/:id", consulta.updateConsulta);
router.delete("/:id", consulta.deleteConsulta);

module.exports = router;
