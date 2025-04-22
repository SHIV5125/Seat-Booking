const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

(async () => {
    try {
        // Insert 77 seats for rows 1-11
        for (let row = 1; row <= 11; row++) {
            for (let pos = 1; pos <= 7; pos++) {
                const seatNumber = (row - 1) * 7 + pos;
                await pool.query(
                    `INSERT INTO seats (seat_number, row_number, position_in_row)
                     VALUES ($1, $2, $3)
                     ON CONFLICT DO NOTHING`,
                    [seatNumber, row, pos]
                );
            }
        }
        
        // Insert last row seats
        await pool.query(`
            INSERT INTO seats (seat_number, row_number, position_in_row) 
            VALUES (78, 12, 1), (79, 12, 2), (80, 12, 3)
            ON CONFLICT DO NOTHING
        `);
        
        console.log("✅ Database seeded successfully");
    } catch (err) {
        console.error("❌ Seeding failed:", err);
    } finally {
        process.exit();
    }
})();