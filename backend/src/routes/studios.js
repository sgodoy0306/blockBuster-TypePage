const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");
const { authorizeRole } = require("../middlewares/roles");
const studiosController = require("../controllers/studiosController");

// Get all studios
router.get("/film_studios", studiosController.getAllStudios);

// Get one studio
router.get("/film_studio/:id", studiosController.getOneStudio);

// Add a new studio (admin only)
router.post("/film_studios", authenticateToken, authorizeRole(true), studiosController.addOneStudio);

// Update a studio (admin only)
router.put("/film_studio/:id", authenticateToken, authorizeRole(true), studiosController.updateOneStudio);

// Delete a studio (admin only)
router.delete("/film_studio/:id", authenticateToken, authorizeRole(true), studiosController.deleteOneStudio);

module.exports = router;
