const fs = require("fs");
const upload = require("../middleware/books_multer");

const express = require("express");
const router = express.Router();
const uploadCourse = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);
router.post("/uploadCourse", auth, async (req, res) => {
  uploadCourse(req, res, async function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({ message: err.message });
    }

    const uploader = async (path) => await cloudinary.uploads(path, "Books"); //function that uploads

    try {
      const urls = {};
      const files = req.files;
      const imagePath = req.files.image[0].path;
      const filePath = req.files.file[0].path;
      const filesArray = Object.keys(files);

      for (const file of filesArray) {
        if (file === "video") {
          print(file);
          // const newPath = await uploader(imagePath);
          // urls["imagePath"] = newPath;
          // fs.unlinkSync(imagePath);
        } else {
          // const newPath = await uploader(filePath);
          // urls["filePath"] = newPath;
          // fs.unlinkSync(filePath);
        }
      }
      // const data = {
      //   usersId: req.user.user_id,
      //   title: req.body.title,
      //   price: req.body.price,
      //   category: req.body.category,
      //   bookCoverImageURL: urls.imagePath.url,
      //   bookURL: urls.filePath.url,
      //   filename: req.body.filename, //wether file or image
      //   createdAt: req.body.createdAt,
      // };
      // addBook(data);
      // res.status(200).json({
      //   success: true,
      //   message: "Book uploaded successfully",
      //   urls: urls,
      //   data: data,
      // });
    } catch (err) {
      console.log(err);
      res.status(200).json({
        message: err,
      });
    }
  });
});
module.exports = router;
