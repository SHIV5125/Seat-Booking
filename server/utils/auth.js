const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.hashPassword = async (password) => await bcrypt.hash(password, 10);
exports.comparePassword = async (password, hash) => await bcrypt.compare(password, hash);
exports.generateToken = (user) => jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
