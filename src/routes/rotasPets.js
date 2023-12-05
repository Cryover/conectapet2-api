const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");

//router.get("/", petController.getAllPets);
router.get("/", petController.getAllPetsByOwner);
router.post("/", petController.createPet);
router.put("/", petController.updatePet);
router.delete("/", petController.deletePet);

module.exports = router;
