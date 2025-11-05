// config/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// ✅ فعال‌سازی JSON
app.use(express.json());

// ✅ CORS فقط در حالت dev
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET','POST','PATCH','DELETE']
  }));
}

// ✅ Routes
app.use('/api/item', require('../routes/api/Item'));
app.use('/api/user', require('../routes/api/user'));
app.use('/api/login', require('../routes/api/login'));

// ✅ اتصال به MongoDB
const MONGO_URI = process.env.URL; // یا process.env.MONGO_URI
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Error connecting to MongoDB:', err));

// ✅ سرو React Build در production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/my-react-app/build')));
  
  app.get('.*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/my-react-app/build', 'index.html'));
  });
}

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
