// importing user context
const User = require("../models/user.model");
const express = require("express");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
// const app = express();

const router = express.Router();

router.get("/showhomepage", async (req, res) => {
  res.send("HEoolos");
});
const jwt = require("jsonwebtoken");
router.post("/register", async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { full_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && full_name)) {
      res
        .status(400)
        .json({ success: false, message: "All input is required" });
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res
        .status(409)
        .json({ success: false, message: "User Already Exist. Please Login" });
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      full_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        // expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(200).json({
      success: true,
      message: "User registered in Successfully 🙌 ",
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

router.post("/login", async (req, res) => {
  // console.log(req.query === {});
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      return res
        .status(400)
        .json({ success: false, message: "All input is required" });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.ACCESS_TOKEN_SECRET
        // {
        //   expiresIn: "2h",
        // }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json({
        success: true,
        message: "Logged in Successfully 🙌 ",
        user: user,
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid Credentials" });
    }
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});
router.get("/getUser", auth, async (req, res) => {
  // console.log(req.user)

  let user = await User.findById(req.user.user_id).select("-password");
  res.status(200).json({
    success: true,
    message: "Info retrieved successfully 🙌 ",
    user: user,
  });
});
router.get("/getAllUsers", async (req, res) => {
  // console.log(req.user)

  User.find({}, function (err, users) {
    res.send(users);
  }).select("-password");
});

router.post("/welcome", auth, async (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
router.post("/all chat", auth, async (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});
module.exports = router;
