// models/Item.js
const { Schema, model } = require("mongoose");

const itemSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true }, // <--- مهم
  date: { type: Date, default: Date.now },
});

const Item = model("Item", itemSchema);

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  isAccountCreated: { type: Boolean, default: false },
});

const User = model("User", userSchema);

module.exports = { Item, User };
