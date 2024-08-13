const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
});
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cartItems: [itemSchema],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", orderSchema);

module.exports = Orders;
