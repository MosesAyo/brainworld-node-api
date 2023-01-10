const getTotalVotes = async (poll) => {
  //add their percentage and total voted
  const votersIds = [];
  const votersForEachOption = {};
  poll.options.forEach((option) => {
    option.votes.forEach((vote_id) => {
      votersIds.push(vote_id);
    });
    votersForEachOption[option.option] = option.votes.length;
  });
  let totalVotes = votersIds.length;

  // poll.totalVotes = totalVotes;
  // poll.votePercentage = votePercentage;
  return { totalVotes, votersForEachOption };
};
const getVotePercentage = async (poll) => {
  let { totalVotes, votersForEachOption } = await getTotalVotes(poll);
  let votePercentage = {};
  poll.options.forEach((option) => {
    votePercentage[option.option] = (
      (votersForEachOption[option.option] * 100) / totalVotes || 0
    ).toFixed(0);
  });
  return votePercentage;
};
module.exports = { getTotalVotes, getVotePercentage };
