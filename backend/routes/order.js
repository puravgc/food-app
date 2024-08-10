const Order = require("../models/Order");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");

router.post("/postorder", checkAuth, async (req, res) => {
  try {
    const { cartItems } = req.body;
    if (!Array.isArray(cartItems)) {
      return res.status(400).json({ message: "Invalid order data" });
    }
    const newOrder = new Order({
      cartItems,
      user: req.user._id,
    });

    await newOrder.save();
    res.json({ success: true, message: "Orders Added" });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ message: "Error adding to orders" });
  }
});

router.get("/getorder", checkAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Error retrieving orders" });
  }
});

module.exports = router;
