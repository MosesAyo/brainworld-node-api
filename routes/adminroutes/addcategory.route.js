const express = require("express");
const router = express.Router();
const CourseCategory = require("../../models/coursecategory.model");

router.post("/addCategory", async (req, res) => {
  console.log(req.query.category);
  try {
    const newCategory = new CourseCategory({
      category: req.query.category,
      description: req.query.description,
    });
    await newCategory.save();
    var categories = await CourseCategory.find({}).lean();

    res.status(200).json({
      success: true,
      message: "added in Successfully 🙌 ",
      categories: categories,
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      success: false,
      message: err.message,
    });
  }
  // Our register logic ends here
});
router.post("/getCategories", async (req, res) => {
  try {
    var categories = await CourseCategory.find({}).lean();

    res.status(200).json({
      success: true,
      message: "fetched Successfully 🙌 ",
      categories: categories,
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      success: false,
      message: err.message,
    });
  }
  // Our register logic ends here
});
module.exports = router;
