const express = require("express");
const router = express.Router();
const historicoDespesasController = require("../controllers/historicoDespesasController");

router.get(
  "/historico_despesas",
  historicoDespesasController.getAllHistoricoDespesas
);
router.post(
  "/historico_despesa",
  historicoDespesasController.createHistoricoDespesa
);
router.put(
  "/historico_despesa/:id",
  historicoDespesasController.updateHistoricoDespesa
);
router.delete(
  "/historico_despesa/:id",
  historicoDespesasController.deleteHistoricoDespesa
);

module.exports = router;
