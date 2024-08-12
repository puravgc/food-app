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

router.put("/orderstatus/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error.message);
    res.status(500).json({ success: false, message: error.message });
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

router.get("/getadminorder", async (req, res) => {
  try {
    const orders = await Order.find();

    res.json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ message: "Error retrieving orders" });
  }
});

router.delete("/deleteorder/:id", async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
});

module.exports = router;
