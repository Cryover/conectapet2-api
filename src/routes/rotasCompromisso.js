const express = require("express");
const router = express.Router();
const compromisso = require("../controllers/compromissoController");

router.get("/bypet/:id", compromisso.getAllCompromissoByIdPet);
router.get("/byowner/:id", compromisso.getAllCompromissoByIdOwner);
router.get("/byowner/:id/dia/:day", compromisso.getAllCompromissoByDay);
router.get("/byowner/:id/mes/:month", compromisso.getAllCompromissoByMonth);
router.get("/byowner/:id/ano/:year", compromisso.getAllCompromissoByYear);
router.post("/", compromisso.createCompromisso);
router.put("/", compromisso.updateCompromisso);
router.patch("/", compromisso.patchCompromisso);
router.delete("/", compromisso.deleteCompromisso);

module.exports = router;
