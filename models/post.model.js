const mongoose = require("mongoose");

// module.exports = USER_TYPES = {
//   NORMALUSER: "normal_user",
//   SUPPORT: "support",
//   ADMIN: "admin",
// };
const postSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    caption: { type: String, max: 500 },
    image: { type: String },
    likes: { type: Array, default: [] },
    comments: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
