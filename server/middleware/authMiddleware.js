const jwt = require("jsonwebtoken");
const pool = require("../db");

exports.requireAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: "Authorization token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [decoded.id]
        );

        if (!user.rows[0]) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user.rows[0];
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};