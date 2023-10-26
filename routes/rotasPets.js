const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");

router.get("/pets", petController.getAllPets);
router.post("/pet", petController.createPet);
router.put("/pet/:id", petController.updatePet);
router.delete("/pet/:id", petController.deletePet);

module.exports = router;
