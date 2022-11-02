const Post = require("../models/post.model");
const auth = require("../middleware/auth");
const upload = require("../middleware/books_multer");
const cloudinary = require("../config/cloudinary.js");
const fs = require("fs");

const express = require("express");
const router = express.Router();

const uploadPicture = upload.single("image");

router.post("/addPost", auth, async (req, res) => {
  // req.caption = req.user.user_id;
  console.log("is hitted");

  uploadPicture(req, res, async function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({ message: err.message });
    }
    const uploader = async (path) => await cloudinary.uploads(path, "Posts");

    try {
      const file = req.file;
      console.log("file");
      console.log(req.body.postedOn);
      if (!file) {
        //no file with post
        const newPost = new Post({
          ...req.body,
          user_id: req.user.user_id,
        });
        const savePost = await newPost.save();
        return res.status(200).json({
          success: true,
          message: "Post createdSuccessfully 🙌 ",
          post: savePost,
        });
      } else {
        const { path } = file;
        const newPath = await uploader(path);
        fs.unlinkSync(path);
        console.log("newPath.url");
        console.log(newPath.url);
        console.log(path);
        const newPost = new Post({
          ...req.body,
          image: newPath.url,
          user_id: req.user.user_id,
        });
        const savePost = await newPost.save();
        return res.status(200).json({
          success: true,
          message: "Post createdSuccessfully 🙌 ",
          post: savePost,
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
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
router.post("/comment", auth, async (req, res) => {
  console.log("ist working");
  if (!req.body.post_id) {
    return res.status(200).json({
      success: false,
      message: "Post id is required",
    });
  }

  try {
    const post = await Post.findById(req.body.post_id);
    //user_id is id of user that wants to comment on a post
    await post.updateOne({
      $push: {
        comments: { user_id: req.user.user_id, comment: req.body.comment },
      },
    });
    res.status(200).json({
      success: true,
      message: "Comment successfully added to post 🙌",
    });
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
