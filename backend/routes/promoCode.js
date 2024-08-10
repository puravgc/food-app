const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const User = require("../models/UserModel");
const Promo = require("../models/PromoCode");
const router = express.Router();

router.post("/addoffer", checkAuth, async (req, res) => {
  try {
    const { code } = req.body;
    const existingPromo = await Promo.findOne({ code: code });
    if (!existingPromo) {
      return res.status(400).json({ message: "Invalid promo code" });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        promoCode: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "Promo code applied successfully",
      success: true,
      existingPromo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
});

router.post("/addpromo", async (req, res) => {
  try {
    const { code, discount } = req.body;
    const newPromo = new Promo({ code, discount });
    await newPromo.save();
    res.json({ message: "Promo code added successfully", newPromo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
