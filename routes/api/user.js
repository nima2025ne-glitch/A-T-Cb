const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { User } = require('../../models/Item'); // چون توی اون فایل export شده

// 📥 ایجاد کاربر جدید
router.post('/', async (req, res) => {

  //بررسی وجود حساب

  const exsist = await User.findOne({ email: req.body.email })

  if(exsist){
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    const salt = await bcrypt.genSalt(10); // ساخت salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt); // هش کردن پسورد

    // ساختن کاربر جدید
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword, // استفاده از پسورد هش‌شده
      email: req.body.email,
      isAccountCreated: req.body.isAccountCreated || false
    });
    const savedUser = await newUser.save();
    const token = jwt.sign(
      { id: savedUser._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } // زمان انقضا توکن 1 ساعت
    );

    // ارسال اطلاعات کاربر به همراه توکن
    res.json({
      message: "User registered successfully",
      token, // توکن JWT که برای کاربر ساخته شده
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📤 دریافت همه کاربران
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
