const mongoose = require("mongoose");

module.exports = USER_TYPES = {
  NORMALUSER: "normal_user",
  SUPPORT: "support",
  ADMIN: "admin",
};
const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    profile_picture: { type: String, default: "" },
    user_type: { type: String, default: "normal_user" },
    token: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
