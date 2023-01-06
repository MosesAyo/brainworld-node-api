const Poll = require("../models/polls.model");
const User = require("../models/user.model");

module.exports = (app, socketIO, db) => {
  socketIO.on("connection", (client) => {
    client.on("pollReaction", async ({ pollReaction: pollReaction }) => {
      const poll = await Poll.findById(pollReaction.poll_id);
      var user = await User.findById(pollReaction.user_id);
      if (!user) return;
      poll.options.forEach((option) => {
        if (option.option === req.body.option) {
          console.log("option push");
          if (option.votes.includes(req.user.user_id)) return;

          option.votes = [...option.votes, user_id];

          console.log("votes");
          console.log(option.votes);
        }
      });
      const pollUpdate = await Poll.findByIdAndUpdate(req.body.poll_id, poll, {
        new: true,
      });

      Poll.find({}, (err, polls) => {
        socketIO.emit("getAllPolls", {
          polls: polls,
          message: message,
          updated_poll: pollUpdate,
        });
      });
    });
  });
};
