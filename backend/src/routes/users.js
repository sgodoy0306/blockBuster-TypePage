const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// User registration
router.post("/register", usersController.register);

// User login
router.post("/login", usersController.login);

module.exports = router;
