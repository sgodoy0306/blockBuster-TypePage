const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth");
const reservationsController = require("../controllers/reservationsController");

// Cancel reservation (any authenticated user)
router.delete("/reservations/:id", authenticateToken, reservationsController.cancelReservation);

module.exports = router;
