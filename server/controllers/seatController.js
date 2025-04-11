const pool = require("../db");

// Get all seats
exports.getSeats = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM seats ORDER BY row_number, seat_number");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seats" });
  }
};

// Book a single seat (optional basic version)
exports.bookSeat = async (req, res) => {
  const { seat_id } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `UPDATE seats 
       SET is_booked = true, user_id = $1 
       WHERE id = $2 AND is_booked = false 
       RETURNING *`,
      [user_id, seat_id]
    );

    if (!result.rowCount) {
      return res.status(400).json({ error: "Seat already booked or not found" });
    }

    res.json({ message: "Seat booked successfully", seat: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Booking failed" });
  }
};

// Cancel booking (optional)
exports.cancelBooking = async (req, res) => {
  const { seat_id } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `UPDATE seats 
       SET is_booked = false, user_id = NULL 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [seat_id, user_id]
    );

    if (!result.rowCount) {
      return res.status(400).json({ error: "Unauthorized or invalid seat" });
    }

    res.json({ message: "Booking cancelled", seat: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Cancellation failed" });
  }
};

// Book multiple seats (your current logic)
exports.bookMultipleSeats = async (req, res) => {
  const { count } = req.body;
  const user_id = req.user.id;

  if (count < 1 || count > 7) {
    return res.status(400).json({ error: "You can book between 1 and 7 seats only" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const allSeats = await client.query(`
      SELECT * FROM seats 
      WHERE is_booked = false 
      ORDER BY row_number, seat_number
    `);

    const availableSeats = allSeats.rows;
    if (availableSeats.length < count) {
      return res.status(400).json({ error: "Not enough seats available" });
    }

    const seatsByRow = {};
    availableSeats.forEach(seat => {
      if (!seatsByRow[seat.row_number]) seatsByRow[seat.row_number] = [];
      seatsByRow[seat.row_number].push(seat);
    });

    let selectedSeats = [];

    // Try same row
    for (const row in seatsByRow) {
      const seats = seatsByRow[row];
      if (seats.length >= count) {
        selectedSeats = seats.slice(0, count);
        break;
      }
    }

    // Fallback
    if (selectedSeats.length === 0) {
      selectedSeats = availableSeats.slice(0, count);
    }

    const seatIds = selectedSeats.map(seat => seat.id);
    for (let id of seatIds) {
      await client.query(`
        UPDATE seats 
        SET is_booked = true, user_id = $1 
        WHERE id = $2
      `, [user_id, id]);
    }

    await client.query("COMMIT");
    res.json({ message: "Seats booked successfully", seats: selectedSeats });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Booking error:", err);
    res.status(500).json({ error: "Booking failed" });
  } finally {
    client.release();
  }

  
};

// Cancel all bookings for the current user
exports.cancelAllBookings = async (req, res) => {
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `UPDATE seats 
       SET is_booked = false, user_id = NULL 
       WHERE user_id = $1
       RETURNING *`,
      [user_id]
    );

    if (!result.rowCount) {
      return res.status(400).json({ error: "No bookings found for the user" });
    }

    res.json({ message: "All your bookings have been cancelled", cancelledSeats: result.rows });
  } catch (err) {
    console.error("Cancel all bookings error:", err);
    res.status(500).json({ error: "Failed to cancel all bookings" });
  }
};
