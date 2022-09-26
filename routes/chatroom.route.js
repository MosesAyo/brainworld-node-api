const User = require("../models/user.model");
const express = require("express");
const router = express.Router();

// controllers
const chatRoom = require("../controllers/chatRoom.controller");

router
  .get("/", chatRoom.getRecentConversation)
  .get("/:roomId", chatRoom.getConversationByRoomId)
  .post("/initiate", chatRoom.initiate)
  .post("/:roomId/message", chatRoom.postMessage)
  .put("/:roomId/mark-read", chatRoom.markConversationReadByRoomId);

export default router;
