const Post = require("../models/post.model");
const User = require("../models/user.model");

const likePost = async (data) => {
  console.log("data inpost");
  console.log(data.user_id);
  try {
    const post = await Post.findById(data.post_id);
    console.log(post.likes);
    if (!post.likes.includes(data.user_id)) {
      //user_id is id of user that wants to like a post
      console.log("user already liked post");
      await post.updateOne({ $push: { likes: data.user_id } });
      return { message: "Post has been liked 🙌" };
    } else {
      await post.updateOne({ $pull: { likes: data.user_id } });
      return { message: "Post has been disliked 🙌" };
    }
  } catch (err) {
    console.log(err);
  }
};
const subscribeToUser = async (data) => {
  console.log("data inpost");
  console.log(data.user_id);
  //user_id is the user that made the post or user to subscribe to
  //subscribers_id is the user that one to subscribe
  try {
    const user = await User.findById(data.user_id); //find the user that made the post
    console.log(user.subscribers);
    if (!user.subscribers.includes(data.subscribers_id)) {
      //user_id is id of user that wants to like a user
      console.log("user already subscribe to user");
      await user.updateOne({ $push: { subscribers: data.subscribers_id } });
      return { message: "You have subscribed to this user 🙌" };
    } else {
      await user.updateOne({ $pull: { subscribers: data.subscribers_id } });
      return { message: "You have subscribed to this user 🙌" };
    }
  } catch (err) {
    console.log(err);
  }
};
const comment = async (data) => {
  try {
    const post = await Post.findById(data.post_id);
    await post.updateOne({
      $push: {
        comments: { user_id: data.user_id, comment: data.comment },
      },
    });
    return { message: "Comment successfully added to post 🙌" };
  } catch (err) {
    console.log(err);
  }
};

module.exports = { likePost, comment, subscribeToUser };
