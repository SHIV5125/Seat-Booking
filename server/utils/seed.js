const { Pool } = require("pg");
require("dotenv").config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

(async () => {
  for (let row = 1; row <= 11; row++) {
    const seatsInRow = row === 11 ? 3 : 7;
    for (let i = 1; i <= seatsInRow; i++) {
      const seat = `R${row}S${i}`;
      await pool.query(
        'INSERT INTO seats (seat_number, row_number) VALUES ($1, $2)',
        [seat, row]
      );
    }
  }
  console.log("✅ Seats seeded");
  process.exit();
})();
