const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");

router.get("/", petController.getAllPets);
router.get("/byOwner/:id", petController.getAllPetsByOwner);
router.post("/", petController.createPet);
router.put("/:id", petController.updatePet);
router.delete("/:id", petController.deletePet);

module.exports = router;
