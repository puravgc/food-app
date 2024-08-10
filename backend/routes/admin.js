const AdminCart = require("../models/AdminCartModel");
const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const validateOrder = [
  body("cartItems").isArray().withMessage("Cart items must be an array"),
  body("cartItems.*.productName")
    .notEmpty()
    .withMessage("Product name is required"),
  body("cartItems.*.price").isNumeric().withMessage("Price must be a number"),
  body("cartItems.*.quantity")
    .isNumeric()
    .withMessage("Quantity must be a number"),
  body("cartItems.*.image").notEmpty().withMessage("Image URL is required"),
  body("cartItems.*.user").notEmpty().withMessage("User ID is required"),
  body("paymentOption").notEmpty().withMessage("Payment option is required"),
];

router.post("/postadminorder", validateOrder, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { cartItems, paymentOption } = req.body;
    if (!Array.isArray(cartItems) || !paymentOption) {
      return res.status(400).json({ message: "Invalid order data" });
    }
    const newOrder = new AdminCart({
      cartItems,
      paymentOption,
    });

    await newOrder.save();
    res.json({ success: true, message: "Admin Orders Added" });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ message: "Error adding to orders" });
  }
});

router.get("/getadminorder", validateOrder, async (req, res) => {
  try {
    const orders = await AdminCart.find().populate(
      "cartItems.user",
      "username email address phoneNumber"
    );
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving orders" });
  }
});

router.delete("/deleteorder/:orderid", async (req, res) => {
  try {
    const order = await AdminCart.findByIdAndDelete(req.params.orderid);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting order", success: false });
  }
});

router.put("/orderstatus/:orderid", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await AdminCart.findByIdAndUpdate(
      req.params.orderid,
      { status: status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found", success: false });
    }
    res.json({
      message: "Order status updated successfully",
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error updating order status", success: false });
  }
});

module.exports = router;
