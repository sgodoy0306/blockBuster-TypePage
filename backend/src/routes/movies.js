const express = require("express");
const router = express.Router();
const { authenticateToken  }  = require("../middlewares/auth");
const { authorizeRole }  = require("../middlewares/roles");
const  moviesController  = require("../controllers/moviesController");

// Get all movies
router.get("/movies", moviesController.getAllMovies);

// Get one movie
router.get("/movie/:id", moviesController.getOneMovie);

// Add a new movie (admin only)
router.post("/movies", authenticateToken, authorizeRole(true), moviesController.addOneMovie);

// Update a movie (admin only)
router.put("/movie/:id", authenticateToken, authorizeRole(true), moviesController.updateOneMovie);

// Delete a movie (admin only)
router.delete("/movie/:id", authenticateToken, authorizeRole(true), moviesController.deleteOneMovie);

// Get actors for a movie
router.get("/movie/:id/actors", moviesController.getActorsByMovieId);

// Add actor to movie (admin only)
router.post("/movie/:id/actors", authenticateToken, authorizeRole(true), moviesController.addActorToMovie);

// Remove actor from movie (admin only)
router.delete("/movie/:id/actor/:actorId", authenticateToken, authorizeRole(true), moviesController.removeActorFromMovie);

module.exports = router;
