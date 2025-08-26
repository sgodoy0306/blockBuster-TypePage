const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");
const { authorizeRole } = require("../middlewares/roles");
const  actorsController  = require("../controllers/actorsController");

// Get all actors
router.get("/actors", actorsController.getAllActors);

// Get one actor
router.get("/actor/:id", actorsController.getOneActor);

// Add a new actor (admin only)
router.post("/actors", authenticateToken, authorizeRole(true), actorsController.addOneActor);

// Update an actor (admin only)
router.put("/actor/:id", authenticateToken, authorizeRole(true), actorsController.updateOneActor);

// Delete an actor (admin only)
router.delete("/actor/:id", authenticateToken, authorizeRole(true), actorsController.deleteOneActor);

// Get movies for an actor
router.get("/actor/:id/movies", actorsController.getMoviesByActorId);

module.exports = router;
