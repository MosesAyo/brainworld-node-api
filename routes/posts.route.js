const Post = require("../models/post.model");
const auth = require("../middleware/auth");

const express = require("express");
const router = express.Router();

router.post("/createPost", auth, async (req, res) => {
  // req.caption = req.user.user_id;
  const newPost = new Post({ ...req.body, user_id: req.user.user_id });
  // console.log(req.user.user_id);
  // console.log(req.body);
  // Our register logic starts here
  console.log(newPost);
  try {
    const savePost = await newPost.save();
    res.status(200).json({
      success: true,
      message: "Post createdSuccessfully 🙌 ",
      post: savePost,
    });
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});
//update post
router.post("/updatePost", auth, async (req, res) => {
  if (!req.body.post_id) {
    return res.status(200).json({
      success: false,
      message: "Post id is required",
    });
  }
  try {
    const post = await Post.findById(req.body.post_id);
    if (post.user_id === req.user.user_id) {
      await post.updateOne({ $set: req.body });
      res.status(200).json({
        success: true,
        message: "Post updated Successfully 🙌",
      });
    } else {
      res.status(403).json({
        success: false,
        message: "You can only update your post ",
      });
    }
    const savePost = await newPost.save();
    res.status(200).json({
      success: true,
      message: "Post created Successfully 🙌 ",
      post: savePost,
    });
  } catch (err) {
    console.log(err);
  }
  // Our update post logic ends here
});

router.post("/likePost", auth, async (req, res) => {
  if (!req.body.post_id) {
    return res.status(200).json({
      success: false,
      message: "Post id is required",
    });
  }

  try {
    const post = await Post.findById(req.body.post_id);
    if (!post.likes.includes(req.body.user_id)) {
      //user_id is id of user that wants to make a post
      await post.updateOne({ $push: { likes: req.body.user_id } });
      res.status(200).json({
        success: true,
        message: "Post has been liked 🙌",
      });
    } else {
      await post.updateOne({ $pull: { likes: req.body.user_id } });

      res.status(200).json({
        success: true,
        message: "Post has been disliked 🙌 ",
      });
    }
  } catch (err) {
    console.log(err);
  }
  // Our like post logic ends here
});
router.post("/getPost", auth, async (req, res) => {
  Post.findById(req.body.post_id, (err, post) => {
    res.status(200).json({
      success: true,
      message: "Info retrieved successfully 🙌 ",
      post,
    });
  });
});
router.post("/getAllPost", auth, async (req, res) => {
  // res.setHeader("Content-Type", "text/html; charset=utf-8");
  // res.writeHead(200, { "Content-Type": "text/plain" });
  // res.setHeader("Transfer-Encoding", "chunked");
  Post.find({}, (err, posts) => {
    return res.json({
      success: true,
      message: "Info retrieved successfully 🙌 ",
      posts,
    });
  });
});
module.exports = router;
