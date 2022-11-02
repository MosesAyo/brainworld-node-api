const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const fs = require("fs");
const cloudinary = require("../config/cloudinary.js");
const upload = require("../middleware/books_multer");
const addBook = require("../controllers/upload.controller");
const Post = require("../models/post.model");
const { url } = require("inspector");

const uploadCourse = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "videos" },
  { name: "file" },
]);

router.post("/uploadCourse", auth, async (req, res) => {
  // console.log(req.user.user_id);
  uploadCourse(req, res, async function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({ message: err.message });
    }
    const uploader = async (path) => await cloudinary.uploads(path, "Books"); //function that uploads

    try {
      const allUrls = {};
      const files = req.files;
      const filesArray = Object.keys(files);

      for (const file of filesArray) {
        if (file === "video") {
          //for single video course intro
          var videoPath = req.files.video[0].path;
          allUrls["videoIntro"] = videoPath;
          // fs.unlinkSync(videoPath);
        } else if (file === "videos") {
          const urls = [];
          const videos = await req.files.videos;
          for (const video of videos) {
            console.log("videodds");
            console.log(video.path);
            var videoPath = await video.path;
            const newPath = await uploader(videoPath);
            urls.push(newPath);
            fs.unlinkSync(videoPath);
          }
          // req.files.videos.forEach(async (video) => {
          //

          //   // fs.unlinkSync(videoPath);
          // });
          console.log("urls");
          allUrls["videoUrls"] = urls;
          console.log(urls);
        } else {
          const urls = [];
          req.files.file.forEach(async (file) => {
            var filePath = await file.path;
            const newPath = await uploader(filePath);
            urls.push(newPath);
            fs.unlinkSync(filePath);
          });
          allUrls["fileUrls"] = urls;
        }
      }

      console.log("allUrls up");
      console.log(allUrls);
      var newPost = new Post({
        user_id: req.user.user_id,
        title: req.body.title,
        price: req.body.price,
        category: req.body.category,
        caption: req.body.caption,
        postType: "course",
        video: allUrls["videoIntro"],
        fileUrls: allUrls["fileUrls"],
        videoUrls: allUrls["videoUrls"],
        // bookCoverImageURL: req.body.bookCoverImageURL,
        // bookURL: newPath,
        // filename: req.filename, //wether file or image
        // createdAt: req.createdAt,
      });
      const savePost = await newPost.save();

      // addBook(data);
      res.status(200).json({
        message: "images uploaded successfully 🙌",
        data: allUrls,
        // url: newPath,
        post: savePost,
      });
      // res.status(200).json({
      //   success: true,
      //   message: "File uploaded Successfully 🙌",
      //   //   file: newPath,
      // });
    } catch (err) {
      console.log(err);
    }
  });
});
module.exports = router;
