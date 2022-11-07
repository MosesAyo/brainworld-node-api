const mongoose = require("mongoose");

// module.exports = USER_TYPES = {
//   NORMALUSER: "normal_user",
//   SUPPORT: "support",
//   ADMIN: "admin",
// };
const orderSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true }, //course owner
    user_id: { type: String, required: true }, //course owner
    current_user_id: { type: String, required: true }, //buyer id owner
    post_id: { type: String, required: true }, //buyer id owner
    current_user_name: { type: String }, //buyer id owner
    email: { type: String }, //buyer id owner
    title: { type: String, max: 200 }, //coure or book title
    price: { type: String, max: 200 },
    orderType: { type: String }, //either course/book
    orderedAt: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
