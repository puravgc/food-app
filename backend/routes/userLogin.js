const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User does not exist. Please sign up." });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect credentials" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);
    res.json({ success: true, message: "Login successful", token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/getuser", checkAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/edituser", checkAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    res.json({
      user: user,
      success: true,
      message: "Updated User Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch("/changepassword", checkAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Incorrect current password", success: false });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New passwords do not match", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
});

router.post("/promocode", async (req, res) => {
  try {
    const { promoCode } = req.body;
    const promo = await PromoCode.findOne({ code: promoCode });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
});

module.exports = router;
