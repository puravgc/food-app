const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const checkAuth = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token || token === "null") {
    return res
      .status(401)
      .json({ message: "Please login first", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userById = await User.findById(decoded.id).select("-password");
    const userByEmail = await User.findOne({ email: decoded.email }).select(
      "-password"
    );

    req.user = userById || userByEmail;

    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Token is not valid", success: false });
  }
};

module.exports = checkAuth;
