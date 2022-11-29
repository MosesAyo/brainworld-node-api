const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Poll = require("../models/polls.model");

router.post("/AddPoll", auth, async (req, res) => {
  try {
    const newPoll = new Poll({
      ...req.body,
      user_id: req.user.user_id,
    });
    const savePoll = await newPoll.save();
    return res.status(200).json({
      success: true,
      message: "Poll created Successfully 🙌 ",
      post: savePoll,
    });
  } catch (error) {
    console.log(error);
  }
  Poll.find({}, function (err, Polls) {
    res.status(200).json({ Polls });
  });
});

router.post("/getAllPolls", async (req, res) => {
  Poll.find({}, function (err, Polls) {
    res.status(200).json({ Polls });
  });
});
module.exports = router;
