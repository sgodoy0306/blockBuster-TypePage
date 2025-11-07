const db = require("../scripts/blockBuster");

const cancelReservation = async (req, res) => {
    const reservationId = req.params.id;
    try {
        // Get reservation to restore stock
        const result = await db.query(
            `SELECT movie_id FROM reservations WHERE id = $1`,
            [reservationId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        const movieId = result.rows[0].movie_id;
        // Delete reservation
        await db.query(`DELETE FROM reservations WHERE id = $1`, [reservationId]);
        // Restore stock
        await db.query(`UPDATE movies SET stock = stock + 1 WHERE id = $1`, [movieId]);
        res.status(204).end();
    } catch (err) {
        console.error("Error cancelling reservation:", err);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    cancelReservation
};
