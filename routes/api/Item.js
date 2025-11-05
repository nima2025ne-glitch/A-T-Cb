//routes/api/item.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Router = express.Router();
const { Item } = require('../../models/Item');

// ✅ Middleware برای چک کردن توکن JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // "Bearer <token>"
  if (!token) return res.status(401).json({ message: 'توکن وجود ندارد ❌' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'توکن نامعتبر است 🚫' });
    req.user = decoded; // حالا userId توی req.user.id هست
    next();
  });
}

// ✅ گرفتن فقط آیتم‌های کاربر لاگین‌کرده
Router.get('/', verifyToken, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user.id }).sort({ date: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ افزودن آیتم برای کاربر لاگین‌کرده
Router.post('/', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    const newItem = new Item({ name, userId: req.user.id });
    const saved = await newItem.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// مسیر PATCH برای ویرایش یک آیتم
Router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;          // گرفتن id آیتم از URL
    const { name } = req.body;          // داده‌های جدید از فرانت

    // پیدا کردن آیتم و بررسی اینکه متعلق به کاربر فعلی هست یا نه
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ error: "آیتم پیدا نشد ❌" });

    if (item.userId !== req.user.id) {
      return res.status(403).json({ error: "شما اجازه ویرایش این آیتم را ندارید ❌" });
    }

    // بروزرسانی فیلدها
    if (name) item.name = name;

    // ذخیره تغییرات در دیتابیس
    const updatedItem = await item.save();

    // ارسال آیتم آپدیت شده به فرانت
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ حذف آیتم
Router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.userId !== req.user.id)
      return res.status(403).json({ message: 'شما اجازه حذف این آیتم را ندارید 🚫' });

    await item.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = Router;
