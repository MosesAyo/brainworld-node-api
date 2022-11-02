const mongoose = require("mongoose");

// module.exports = USER_TYPES = {
//   NORMALUSER: "normal_user",
//   SUPPORT: "support",
//   ADMIN: "admin",
// };
const courseCategorySchema = new mongoose.Schema(
  {
    admin_id: {
      type: String,
      default: "",
      // required: true
    },
    category: { type: String, max: 200 },
    description: { type: String, max: 700 },
    image: { type: String },
    // comments: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CourseCategory", courseCategorySchema);
