const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const { createServer } = require("http");
const User = require("./models/UserModel");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "bae00d5c98b4",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        email: profile.emails[0].value,
      });
      if (existingUser) {
        return done(null, { user: existingUser, userExists: true });
      }
      const userData = {
        googleId: profile.id,
        username: profile.displayName || "User" + profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName || "",
        lastName: profile.name.familyName || "",
      };
      return done(null, { user: userData, userExists: false });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/signup",
  }),
  (req, res) => {
    const { user, userExists } = req.user;
    console.log(userExists);
    const token = jwt.sign(
      { id: user.googleId, email: user.email },
      process.env.JWT_SECRET
    );
    const userString = encodeURIComponent(JSON.stringify(user));
    const tokenString = encodeURIComponent(token);
    const redirectUrl = userExists
      ? `http://localhost:5173/order?token=${tokenString}`
      : `http://localhost:5173/details?user=${userString}`;
    res.redirect(redirectUrl);
  }
);

app.use(require("./routes/userSignup"));
app.use(require("./routes/userLogin"));
app.use(require("./routes/addCart"));
app.use(require("./routes/order"));
app.use(require("./routes/promoCode"));
app.use(require("./routes/admin"));
app.use(require("./routes/esewaIntegration"));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("username: " + socket.id);
  socket.on("checkoutcart", (data) => {
    console.log(data);
    io.emit("cartdetails", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
