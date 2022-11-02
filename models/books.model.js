const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  usersId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String },
  bookCoverImageURL: { type: String },
  bookURL: { type: String },
  filename: { type: String }, //wether file or image
  createdAt: { type: String },
});

module.exports = mongoose.model("Book", booksSchema);
