const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const { getSeats, bookSeats, cancelAllBookings } = require("../controllers/seatController");

router.get("/", requireAuth, getSeats);
router.post("/book", requireAuth, bookSeats);
router.delete("/cancel-all", requireAuth, cancelAllBookings);

module.exports = router;