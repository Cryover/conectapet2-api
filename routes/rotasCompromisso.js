const express = require("express");
const router = express.Router();
const compromisso = require("../controllers/compromissoController");

router.get("/", compromisso.getAllCompromisso);
router.get("/bypet/:id"), compromisso.getAllCompromissoByIdPet;
router.get("/byowner/:id", compromisso.getAllCompromissoByIdOwner);
router.post("/", compromisso.createCompromisso);
router.put("/:id", compromisso.updateCompromisso);
router.delete("/:id", compromisso.deleteCompromisso);

module.exports = router;
