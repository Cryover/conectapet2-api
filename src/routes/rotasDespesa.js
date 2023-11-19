const express = require("express");
const router = express.Router();
const despesaController = require("../controllers/despesaController");

router.get("/", despesaController.getAllDespesa);
router.get("/pet/:id", despesaController.getAllDespesaByIdPet);
router.get("/owner/:id", despesaController.getAllDespesaByIdOwner);
router.post("/", despesaController.createDespesa);
router.put("/:id", despesaController.updateDespesa);
router.delete("/:id", despesaController.deleteDespesa);

module.exports = router;
