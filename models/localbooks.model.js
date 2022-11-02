const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  usersId: { type: String, required: true },
  title: { type: String },
  category: { type: String },
  bookURL: { type: String },
  filename: { type: String }, //wether file or image
  createdAt: { type: String },
});

module.exports = mongoose.model("LocalBook", booksSchema);
