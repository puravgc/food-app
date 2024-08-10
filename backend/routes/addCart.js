const Cart = require("../models/CartModel");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");

router.post("/addtocart", checkAuth, async (req, res) => {
  try {
    const { productName, price, quantity, image } = req.body;
    const newItem = new Cart({
      productName,
      price,
      quantity,
      image,
      user: req.user._id,
    });
    await newItem.save();
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding to cart" });
  }
});



router.delete("/removefromcart/:id", checkAuth, async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!cartItem) return res.status(404).json({ message: "Item not found" });
    res.json({
      success: true,
      message: "Item removed from cart",
      quantity: cartItem.quantity,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error removing from cart" });
  }
});

router.patch("/updatecart/:id", checkAuth, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cartItem = await Cart.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { quantity },
      { new: true }
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Quantity updated successfully", cartItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getcart", checkAuth, async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user._id });
    res.json({ cartItems, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving cart items" });
  }
});

module.exports = router;
