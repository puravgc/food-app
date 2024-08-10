const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
