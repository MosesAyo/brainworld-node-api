const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Book = require("../models/books.model");

router.get("/getAllUsers", async (req, res) => {
  Book.find({}, function (err, books) {
    res.status(200).json({ books });
  });
});
