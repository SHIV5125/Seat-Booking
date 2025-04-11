const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('❌ Database connection failed:', err);
    } else {
      console.log('✅ Connected to the database at:', res.rows[0].now);
    }
  });
  
const authRoutes = require("./routes/authRoutes");
const seatRoutes = require("./routes/seatRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
