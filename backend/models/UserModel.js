const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  username: { type: String },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  phoneNumber: { type: String },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  promoCode: { type: Boolean },
  resetPasswordOtp: { type: String },
  resetPasswordExpiry: { type: Date },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
