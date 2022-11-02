const auth = require("../middleware/auth");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary.js");
const upload = require("../middleware/books_multer");
const addBook = require("../controllers/upload.controller");
const addBookToLocal = require("../controllers/upload.controller");
const Book = require("../models/books.model");
const LocalBook = require("../models/localbooks.model");

const uploadBook = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);
const uploadToLocalLibrary = upload.single("file");

router.post("/uploadToLocalLibrary", auth, async (req, res) => {
  console.log("back is hitted");
  uploadToLocalLibrary(req, res, async function (err) {
    if (err) {
      console.log(err);
      return res.status(400).send({ message: err.message });
    }

    const uploader = async (path) =>
      await cloudinary.uploads(path, "UserBooks"); //function that uploads

    try {
      const file = req.file;
      const { path } = file;
      const newPath = await uploader(path);
      fs.unlinkSync(path);

      const data = new LocalBook({
        usersId: req.user.user_id,
        title: req.body.title,
        category: req.body.category,
        // bookCoverImageURL: urls.imagePath.url,
        bookURL: String(newPath.url),
        filename: req.body.filename, //wether file or image
        createdAt: req.body.createdAt,
      });
      await data.save();
      res.status(200).json({
        success: true,
        message: "Book uploaded successfully",
        url: newPath,
        data: data,
      });
    } catch (err) {
      console.log(err);
      res.status(200).json({
        message: err,
      });
    }
  });
});
router.post("/getAllBooks", auth, async (req, res) => {
  Book.find({}, function (err, books) {
    var categories = [];
    for (const book of books) {
      if (!categories.includes(book.category)) {
        categories.push(book.category);
      }
    }
    res.status(200).json({ books, categories });
  });
});
router.post("/uploadBook", auth, async (req, res) => {
  uploadBook(req, res, async function (err) {
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
        if (file === "image") {
          const newPath = await uploader(imagePath);
          urls["imagePath"] = newPath;
          fs.unlinkSync(imagePath);
        } else {
          const newPath = await uploader(filePath);
          urls["filePath"] = newPath;
          fs.unlinkSync(filePath);
        }
      }
      const data = {
        usersId: req.user.user_id,
        title: req.body.title,
        price: req.body.price,
        category: req.body.category,
        bookCoverImageURL: urls.imagePath.url,
        bookURL: urls.filePath.url,
        filename: req.body.filename, //wether file or image
        createdAt: req.body.createdAt,
      };
      addBook(data);
      res.status(200).json({
        success: true,
        message: "Book uploaded successfully",
        urls: urls,
        data: data,
      });
    } catch (err) {
      console.log(err);
      res.status(200).json({
        message: err,
      });
    }
  });
});

router.post("/getUserBooks", auth, async (req, res) => {
  console.log("backend is hitted");
  LocalBook.find({ usersId: req.user.user_id }, function (err, books) {
    var categories = [];
    for (const book of books) {
      if (!categories.includes(book.category)) {
        categories.push(book.category);
      }
    }
    res.status(200).json({ books, categories });
  });
});
router.post("/getUserCategoryBooks", async (req, res) => {
  Book.find({ category: req.body.category }, function (err, books) {
    res.status(200).json({ books });
  });
});
router.post("/getAllBooks", auth, async (req, res) => {
  Book.find({}, function (err, books) {
    var categories = [];
    for (const book of books) {
      if (!categories.includes(book.category)) {
        categories.push(book.category);
      }
    }
    res.status(200).json({ books, categories });
  });
});
router.post("/getUserBooks", auth, async (req, res) => {
  Book.find({ usersId: req.user.user_id }, function (err, books) {
    var categories = [];
    for (const book of books) {
      if (!categories.includes(book.category)) {
        categories.push(book.category);
      }
    }
    res.status(200).json({ books, categories });
  });
});
router.post("/getUserCategoryBooks", async (req, res) => {
  Book.find({ category: req.body.category }, function (err, books) {
    res.status(200).json({ books });
  });
});
module.exports = router;
