//routes/api/login.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  // فراموش نکن
const { User } = require('../../models/Item');

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    // پیدا کردن کاربر بر اساس username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'کاربر یافت نشد ❌' });
    }

    // بررسی رمز عبور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'رمز عبور اشتباه است 🔒' });
    }

    // ساخت توکن JWT
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // ارسال توکن به کاربر
  res.json({
  message: "Login successful",
  token,            // توکن JWT
  user: {
    _id: user._id,
    username: user.username,
    email: user.email
  }
});


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
