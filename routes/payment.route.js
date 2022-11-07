const fs = require("fs");
const upload = require("../middleware/books_multer");
const auth = require("../middleware/auth");
const express = require("express");
const Order = require("../models/order.model");
const Post = require("../models/post.model");
const Book = require("../models/books.model");
const router = express.Router();
const uploadCourse = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

router.post("/orderItem", async (req, res) => {
  console.log(req.body);

  try {
    var order = new Order({
      order_id: req.body.order_id,
      user_id: req.body.user_id,
      current_user_id: req.body.current_user_id,
      post_id: req.body.post_id,
      current_user_name: req.body.current_user_name,
      email: req.body.email,
      title: req.body.title,
      price: req.body.price, //wether file or image
      orderType: req.body.orderType,
      orderedAt: req.body.orderedAt,
    }).save();
    return res.status(200).json({
      success: true,
      message: "Order placed successfuly",
      order: order,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ success: true, message: error, order: order });
  }
});
router.post("/getUserOrders", auth, async (req, res) => {
  try {
    var orders = await Order.find({ current_user_id: req.user.user_id });
    var totalSpent = 0;
    var totalSpentOnBooks = 0;
    var totalSpentOnCourses = 0;
    var onCourses = [];
    var onBooks = [];
    for (const order of orders) {
      totalSpent += parseInt(order.price);
      if (order.orderType == "book") {
        totalSpentOnBooks += parseInt(order.price);
        const book = await Book.findById(order.post_id);
        onBooks.push(book);
      } else if (order.orderType == "course") {
        totalSpentOnCourses += parseInt(order.price);
        const course = await Post.findById(order.post_id);
        onCourses.push(course);
      }
    }
    console.log("oncourse");
    console.log(onCourses);
    console.log("onBooks");
    console.log(onBooks);
    return res.status(200).json({
      success: true,
      message: "Order placed successfuly",
      totalSpent: totalSpent,
      totalSpentOnBooks: totalSpentOnBooks,
      totalSpentOnCourses: totalSpentOnCourses,
      orders: orders,
      onBooks: onBooks,
      onCourses: onCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ success: true, message: error });
  }
});

module.exports = router;
