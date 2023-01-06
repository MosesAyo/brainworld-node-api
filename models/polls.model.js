const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true }, //course owner
    question: { type: String },
    options: { type: Array, default: [] },
    votes: { type: Array, default: [] },
    createAt: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Poll", pollSchema);
