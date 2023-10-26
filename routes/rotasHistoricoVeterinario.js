const express = require("express");
const router = express.Router();
const historicoVeterinario = require("../controllers/historicoVeterinarioController");

router.get(
  "/historico_veterinarios",
  historicoVeterinario.getAllHistoricoVeterinarios
);
router.post(
  "/historico_veterinario",
  historicoVeterinario.createHistoricoVeterinario
);
router.put(
  "/historico_veterinario/:id",
  historicoVeterinario.updateHistoricoVeterinario
);
router.delete(
  "/historico_veterinario/:id",
  historicoVeterinario.deleteHistoricoVeterinario
);

module.exports = router;
