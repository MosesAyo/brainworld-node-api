const express = require("express");
const router = express.Router();

router.post("/addCourse", async (req, res) => {
  // Our register logic starts here
  try {
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
