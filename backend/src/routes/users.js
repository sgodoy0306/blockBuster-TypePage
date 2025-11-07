const express = require("express");
const router = express.Router();
const  usersController  = require("../controllers/usersController");
const { authenticateToken } = require("../middlewares/auth");

// User registration
router.post("/users/register", usersController.register);

// User login
router.post("/users/login", usersController.login);

router.get('/users/me', authenticateToken, usersController.getUserInfo);

// Get all reservations for a user
router.get('/users/:id/reservations', authenticateToken, usersController.getUserReservations);

module.exports = router;
