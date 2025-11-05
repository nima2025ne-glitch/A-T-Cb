// routes/api/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/login", (req, res) => {
  const jwtSecret = process.env.JWT_SECRET;
  const user = { id: 1, username: "nima" }; // فقط تستی

  const token = jwt.sign(user, jwtSecret, { expiresIn: "1h" });
  res.json({ token });
});

router.get("/verify", (req, res) => {
  const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  const jwtSecret = process.env.JWT_SECRET;

  const token = req.header(tokenHeaderKey);
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const verified = jwt.verify(token, jwtSecret);
    res.json({ message: "✅ Verified", data: verified });
  } catch (err) {
    res.status(401).json({ message: "❌ Invalid token" });
  }
});

module.exports = router;
