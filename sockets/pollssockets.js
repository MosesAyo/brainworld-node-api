const Poll = require("../models/polls.model");
const User = require("../models/user.model");

module.exports = (app, socketIO, db) => {
  socketIO.on("connection", (client) => {
    client.on("pollReaction", async ({ pollReaction: pollReaction }) => {
      console.log("poll have been reacted");
      const poll = await Poll.findById(pollReaction.poll_id);
      if (pollReaction.reactionType === "none") {
        Poll.find({}, (err, polls) => {
          socketIO.emit("getAllPolls", {
            success: true,
            polls: polls,
            message: "Success",
            // updated_poll: pollUpdate,
          });
        });
        return;
      }
      //if is to vote poll
      var user = await User.findById(pollReaction.user_id);
      // if (!user) {return};
      const votersIds = [];
      poll.options.forEach((option) => {
        option.votes.forEach((vote_id) => {
          votersIds.push(vote_id);
        });
      });
      const index = votersIds.indexOf(pollReaction.user_id);
      console.log(index);
      if (index >= 0) {
        Poll.find({}, (err, polls) => {
          socketIO.emit("getAllPolls", {
            success: false,
            polls: polls,
            message: "User have voted already",
          });
        });
        return;
      }
      poll.options.forEach((option) => {
        if (option.option === pollReaction.option) {
          option.votes = [...option.votes, pollReaction.user_id];
          console.log("votes successful");
        }
      });
      const pollUpdate = await Poll.findByIdAndUpdate(
        pollReaction.poll_id,
        poll,
        {
          new: true,
        }
      );

      Poll.find({}, (err, polls) => {
        socketIO.emit("getAllPolls", {
          success: true,
          polls: polls,
          message: "Voted " + pollReaction + "option",
          updated_poll: pollUpdate,
        });
      });
    });
  });
};
