const Poll = require("../models/polls.model");
const User = require("../models/user.model");
const getPollInfo = require("../controllers/poll.controller");

module.exports = (app, socketIO, db) => {
  socketIO.on("connection", (client) => {
    client.on("pollReaction", async ({ pollReaction: pollReaction }) => {
      if (pollReaction.reactionType === "none") {
        let polls = await Poll.find({}).lean();

        for (var poll of polls) {
          //add their percentage and total voted
          let { totalVotes } = await getPollInfo.getTotalVotes(poll);

          poll.totalVotes = totalVotes;
          poll.votePercentage = await getPollInfo.getVotePercentage(poll);
        }
        socketIO.emit("getAllPolls", {
          success: false,
          polls: polls,
          message: "Successfully retrieved polls",
        });
        return;
      } else {
        //if is to vote poll
        var user = await User.findById(pollReaction.user_id);
        const poll = await Poll.findById(pollReaction.poll_id);
        // if (!user) {return};
        const votersIds = [];

        poll.options.forEach((option) => {
          option.votes.forEach((vote_id) => {
            votersIds.push(vote_id);
          });
        });
        const index = votersIds.indexOf(pollReaction.user_id);
        if (index >= 0) {
          console.log("users has voted already");
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
        let polls = await Poll.find({}).lean();

        for (var poll2 of polls) {
          //add their percentage and total voted
          let { totalVotes } = await getPollInfo.getTotalVotes(poll2);
          poll2.totalVotes = totalVotes;
          poll2.votePercentage = await getPollInfo.getVotePercentage(poll2);
        }

        socketIO.emit("getAllPolls", {
          success: true,
          polls: polls,
          message: "Voted " + pollReaction + "option",
          updated_poll: pollUpdate,
        });
      }
    });
  });
};
