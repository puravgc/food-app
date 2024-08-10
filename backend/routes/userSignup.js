const User = require("../models/UserModel");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  try {
    //Fetch Data from frontend
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      address,
      phoneNumber,
    } = req.body;

    //check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      address,
      phoneNumber,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
