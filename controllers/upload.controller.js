require("../config/cloudinary.js");

const Book = require("../models/books.model");
const LocalBook = require("../models/localbooks.model");

const addBook = (data) => {
  return new Book({
    usersId: data.usersId,
    title: data.title,
    price: data.price,
    category: data.category,
    bookCoverImageURL: data.bookCoverImageURL,
    bookURL: data.bookURL,
    filename: data.filename, //wether file or image
    createdAt: data.createdAt,
  }).save();
};
module.exports = addBook;
