const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
const adminCartSchema = new mongoose.Schema({
  cartItems: [itemSchema],
  paymentOption: { type: String, required: true },
  status: { type: String, default: "pending" },
});

const AdminCart = mongoose.model("AdminCart", adminCartSchema);

module.exports = AdminCart;
