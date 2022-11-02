// const { addUser } = require("../helpers/misc");
// const Messages = require("../schema/Messages");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const reactOnPost = require("../controllers/post.controller");

module.exports = (app, socketIO, db) => {
  //   io.on("connection", function (socket) {

  //   })
  socketIO.on("connection", (client) => {
    client.on("postReaction", async ({ postReaction: postReaction }) => {
      //post reaction reactionType(like,comment),userid, postid
      if (postReaction.reactionType === "like") {
        var message = await reactOnPost.likePost(postReaction);
        var user = await User.findById(postReaction.user_id);
        Post.find({}, (err, posts) => {
          socketIO.emit("getAllPost", {
            posts: posts,
            message: message,
            comment: null,
            subscribers: user.subscribers,
          });
        });
      } else if (postReaction.reactionType === "comment") {
        var message = await reactOnPost.comment(postReaction);
        var user = await User.findById(postReaction.user_id);

        Post.find({}, (err, posts) => {
          socketIO.emit("getAllPost", {
            posts: posts,
            message: message,
            comment: postReaction.comment,
            subscribers: user.subscribers,
          });
        });
      } else if (postReaction.reactionType === "subscribe") {
        var message = await reactOnPost.subscribeToUser(postReaction);
        const post = await Post.findById(postReaction.post_id);
        const user = await User.findById(post.user_id);

        Post.find({}, (err, posts) => {
          socketIO.emit("getAllPost", {
            message: message,
            posts: posts,
            subscribers: user.subscribers,
            // user: user,
          });
        });
      } else {
        var user = await User.findById(postReaction.user_id);
        Post.find({}, (err, posts) => {
          socketIO.emit("getAllPost", {
            posts: posts,
            message: "Data fetched successfully",
            subscribers:
              postReaction.pageType == "home" ? [] : user.subscribers,
          });
        });
      }
    });
  });
};
