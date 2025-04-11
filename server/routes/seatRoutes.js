const express = require("express");
const router = express.Router();
const {
  getSeats,
  bookSeat,
  cancelBooking,
  bookMultipleSeats,
  cancelAllBookings
} = require("../controllers/seatController");

const { requireAuth } = require("../middleware/authMiddleware");

router.get("/", requireAuth, getSeats);
router.post("/book", requireAuth, bookSeat);
router.post("/cancel", requireAuth, cancelBooking);
router.post("/book-multiple", requireAuth, bookMultipleSeats);
router.post("/cancel-all", requireAuth, cancelAllBookings);

module.exports = router;
