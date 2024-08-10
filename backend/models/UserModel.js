const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  username: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  promoCode: { type: Boolean },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
