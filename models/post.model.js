const mongoose = require("mongoose");

// module.exports = USER_TYPES = {
//   NORMALUSER: "normal_user",
//   SUPPORT: "support",
//   ADMIN: "admin",
// };
const postSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    title: { type: String, max: 200 },
    price: { type: String, max: 200 },
    category: { type: String, max: 500 },
    image: { type: String },
    video: { type: String }, //this is intro video for courses
    postType: { type: String, default: "post" }, //either course/post
    fileUrls: { type: Array, default: [] },
    videoUrls: { type: Array, default: [] },
    likes: { type: Array, default: [] },
    comments: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
