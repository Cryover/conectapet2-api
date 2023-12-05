const express = require("express");
const router = express.Router();
const despesaController = require("../controllers/despesaController");

//router.get("/", despesaController.getAllDespesa);
router.get("/bypet/:id", despesaController.getAllDespesaByIdPet);
router.get("/byowner/:id", despesaController.getAllDespesaByIdOwner);
router.get("/byowner/:id/dia", despesaController.getAllDespesaByDay);
router.get("/byowner/:id/mes", despesaController.getAllDespesaByMonth);
router.get("/byowner/:id/ano", despesaController.getAllDespesaByYear);
router.post("/", despesaController.createDespesa);
router.put("/", despesaController.updateDespesa);
router.delete("/", despesaController.deleteDespesa);

module.exports = router;
