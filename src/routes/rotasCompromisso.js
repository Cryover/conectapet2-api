const express = require("express");
const router = express.Router();
const compromisso = require("../controllers/compromissoController");

router.get("/", compromisso.getAllCompromisso);
router.get("/bypet/:id"), compromisso.getAllCompromissoByIdPet;
router.get("/byowner/:id", compromisso.getAllCompromissoByIdOwner);
router.get("/byowner/:id/dia", compromisso.getAllCompromissoByDay);
router.get("/byowner/:id/mes", compromisso.getAllCompromissoByMonth);
router.get("/byowner/:id/ano", compromisso.getAllCompromissoByYear);
router.post("/", compromisso.createCompromisso);
router.put("/", compromisso.updateCompromisso);
router.delete("/", compromisso.deleteCompromisso);

module.exports = router;
