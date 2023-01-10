const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Poll = require("../models/polls.model");

let votes = [];

router.post("/addPoll", auth, async (req, res) => {
  try {
    console.log(req.body.options);
    var options = [];
    req.body.options.map(
      (option) => options.push({ option: option, votes: [] })
      // option:0
      // (options = "key : " + option + " value : " + option)
    );
    const newPoll = new Poll({
      ...req.body,
      options: options,
      // options: req.body.options.map((option) => ({
      //   name: option,
      //   count: 0,
      // })),
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

router.post("/votePoll", auth, async (req, res) => {
  if (!req.body.poll_id) {
    return res.status(200).json({
      success: false,
      message: "Poll id is required",
    });
  }

  try {
    const poll = await Poll.findById(req.body.poll_id);
    // console.log(poll);
    if (!poll.votes.includes(req.user.user_id)) {
      //if it does not have this user add the user to vote
      await poll.updateOne({ $push: { votes: req.user.user_id } });
    }
    for (const option of poll.options) {
      console.log(option);
      console.log(option.option);
      if (option.votes.includes(req.user.user_id)) {
        console.log("Oya o");
        await poll.updateOne(option, {
          $set: { "votes.$": req.body.user_id },
        });
        await option.votes.pull({ updateOne: { user_id } });
      } else {
        console.log("No o");
        var user_id = req.user.user_id;
        await poll.updateOne(option.option, {
          $set: { "votes.$": req.body.user_id },
        });
        // await option.votes.push({ updateOne: { user_id } });
      }
    }
    return res.status(200).json({
      success: true,
      message: "vote has been casted 🙌",
      poll: poll,
    });
  } catch (err) {
    console.log(err);
  }
  // Our like poll logic ends here
});
router.post("/votePercentage", auth, async (req, res) => {
  if (!req.body.poll_id) {
    return res.status(200).json({
      success: false,
      message: "Poll id is required",
    });
  }
  try {
    const poll = await Poll.findById(req.body.poll_id);
    const user_id = req.user.user_id;
    const votersIds = [];
    const votersForEachOption = {};
    poll.options.forEach((option) => {
      option.votes.forEach((vote_id) => {
        votersIds.push(vote_id);
        console.log(option.votes.length);
      });
      votersForEachOption[option.option] = option.votes.length;
    });
    let totalVotes = votersIds.length;
    console.log("totalVotes");
    console.log(totalVotes);
    console.log(votersForEachOption);
    let votePercentage = {};
    poll.options.forEach((option) => {
      votePercentage[option.option] =
        (votersForEachOption[option.option] / totalVotes) * 100 + "%";
    });
    console.log(votePercentage);
    return res.status(200).json({
      success: true,
      message: "vote has been casted 🙌",
      poll: poll,
    });
  } catch (err) {
    console.log(err);
  }
});
router.post("/votePoll1", auth, async (req, res) => {
  if (!req.body.poll_id) {
    return res.status(200).json({
      success: false,
      message: "Poll id is required",
    });
  }

  try {
    const poll = await Poll.findById(req.body.poll_id);
    console.log(req.body.option);
    const user_id = req.user.user_id;
    const votersIds = [];
    poll.options.forEach((option) => {
      option.votes.forEach((vote_id) => {
        votersIds.push(vote_id);
      });
    });
    console.log(votersIds);
    const index = votersIds.indexOf(req.user.user_id);
    console.log(index);
    if (index >= 0) return;

    poll.options.forEach((option) => {
      if (option.option === req.body.option) {
        option.votes = [...option.votes, user_id];
        console.log("votes successful");
      }
    });
    const pollUpdate = await Poll.findByIdAndUpdate(req.body.poll_id, poll, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      message: "vote has been casted 🙌",
      poll: pollUpdate,
    });
  } catch (err) {
    console.log(err);
  }
  // Our like poll logic ends here
});
module.exports = router;
