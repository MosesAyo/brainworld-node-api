const mongoose = require("mongoose");

const chatsSchema = new mongoose.Schema({
  chatID: { type: String, default: null, required: true },
  sendersid: { type: String },
  sendersEmail: { type: String },
  receiversEmail: { type: String },
  messageText: { type: String },
  imageURL: { type: String },
  type: { type: String }, //wether file or imagec
  sentAt: { type: String },
  createdAt: { type: String, default: Date.now },
});

module.exports = mongoose.model("Chat", chatsSchema);
