const pool = require("../db");

exports.getSeats = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                s.seat_number,
                s.row_number,
                s.position_in_row,
                s.is_booked,
                b.user_id
            FROM seats s
            LEFT JOIN booking_seats bs ON s.seat_number = bs.seat_number
            LEFT JOIN bookings b ON bs.booking_id = b.booking_id
            ORDER BY s.seat_number
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch seats" });
    }
};

exports.bookSeats = async (req, res) => {
    const { count } = req.body;
    const userId = req.user.id;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Find available seats
        const available = await client.query(`
            SELECT s.seat_number, s.row_number
            FROM seats s
            WHERE NOT EXISTS (
                SELECT 1 FROM booking_seats bs 
                WHERE bs.seat_number = s.seat_number
            )
            ORDER BY s.row_number, s.seat_number
        `);

        if (available.rows.length < count) {
            return res.status(400).json({ error: "Not enough seats available" });
        }

        // Seat selection logic
        let selectedSeats = [];
        const rowMap = new Map();
        
        available.rows.forEach(seat => {
            if (!rowMap.has(seat.row_number)) {
                rowMap.set(seat.row_number, []);
            }
            rowMap.get(seat.row_number).push(seat);
        });

        // Find seats in same row
        for (const [row, seats] of rowMap) {
            if (seats.length >= count) {
                selectedSeats = seats.slice(0, count);
                break;
            }
        }

        // Find consecutive seats
        if (selectedSeats.length === 0) {
            let consecutive = [];
            for (let i = 0; i <= available.rows.length - count; i++) {
                const currentBlock = available.rows.slice(i, i + count);
                if (currentBlock.every((seat, index) => 
                    index === 0 || seat.seat_number === currentBlock[index-1].seat_number + 1
                )) {
                    consecutive = currentBlock;
                    break;
                }
            }
            selectedSeats = consecutive.length > 0 ? consecutive : available.rows.slice(0, count);
        }

        // Create booking
        const bookingRes = await client.query(
            'INSERT INTO bookings (user_id) VALUES ($1) RETURNING booking_id',
            [userId]
        );
        const bookingId = bookingRes.rows[0].booking_id;

        // Update seats and booking_seats
        await client.query(`
            INSERT INTO booking_seats (booking_id, seat_number)
            SELECT $1, unnest($2::int[])
        `, [bookingId, selectedSeats.map(s => s.seat_number)]);

        await client.query(`
            UPDATE seats
            SET is_booked = true
            WHERE seat_number = ANY($1)
        `, [selectedSeats.map(s => s.seat_number)]);

        await client.query('COMMIT');
        res.json({ 
            message: `${count} seats booked successfully`,
            seats: selectedSeats.map(s => s.seat_number)
        });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: "Booking failed" });
    } finally {
        client.release();
    }
};

exports.cancelAllBookings = async (req, res) => {
    const user_id = req.user.id;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        
        // Get all booked seats by user
        const bookedSeats = await client.query(`
            SELECT bs.seat_number 
            FROM booking_seats bs
            JOIN bookings b ON bs.booking_id = b.booking_id
            WHERE b.user_id = $1
        `, [user_id]);

        // Delete all user's bookings
        await client.query(`
            DELETE FROM bookings 
            WHERE user_id = $1
        `, [user_id]);

        // Update seats status
        await client.query(`
            UPDATE seats
            SET is_booked = false
            WHERE seat_number = ANY($1)
        `, [bookedSeats.rows.map(s => s.seat_number)]);

        await client.query('COMMIT');
        res.json({ 
            message: "All bookings cancelled successfully",
            cancelledSeats: bookedSeats.rows.map(s => s.seat_number)
        });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: "Failed to cancel all bookings" });
    } finally {
        client.release();
    }
};