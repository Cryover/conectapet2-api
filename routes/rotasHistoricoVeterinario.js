const express = require("express");
const router = express.Router();
const historicoVeterinario = require("../controllers/historicoVeterinarioController");

router.get("/", historicoVeterinario.getAllHistoricoVeterinarios);
router.get("/:id"), historicoVeterinario.getHistoricoVeterinariosByIdPet;
router.post("/", historicoVeterinario.createHistoricoVeterinario);
router.put("/:id", historicoVeterinario.updateHistoricoVeterinario);
router.delete("/:id", historicoVeterinario.deleteHistoricoVeterinario);

module.exports = router;
