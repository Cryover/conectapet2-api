const express = require("express");
const router = express.Router();
const historicoDespesasController = require("../controllers/historicoDespesasController");

router.get("/", historicoDespesasController.getAllHistoricoDespesas);
router.post("/", historicoDespesasController.createHistoricoDespesa);
router.put("/:id", historicoDespesasController.updateHistoricoDespesa);
router.delete("/:id", historicoDespesasController.deleteHistoricoDespesa);

module.exports = router;
