// const { addUser } = require("../helpers/misc");
// const Messages = require("../schema/Messages");
const User = require("../models/user.model");
const addUser = require("../helpers/misc");
const sendMessage = require("../controllers/chat.controller");
const Chat = require("../models/chat.model");

module.exports = (app, socketIO, db) => {
  //   io.on("connection", function (socket) {

  //   })
  socketIO.on("connection", (socket) => {
    console.log("Connection Successfully", socket.id);

    socket.on("disconnect", () => {
      console.log("Disconnected Successfully");
    });
    socket.on("message", (data) => {
      console.log("message Successfully", data);
      socket.broadcast.emit("message-receive", data);
    });
    socket.on("_getUsers", ({ senderEmail }) => {
      User.find({}, (err, users) => {
        socketIO.emit("_allUsers", users);
      }).select("-password"); //get all users and remove the password
    });

    socket.on("_getAllChats", ({ chatID }) => {
      Chat.find({ chatID: chatID }, (err, chats) => {
        // console.log(chatID);
        // console.log(chats);
        socketIO.emit("_allChats", chats);
      }); //get all users and remove the password
    });

    socket.on("sendMessage", (data) => {
      console.log("message Successfully", data.sendersid);
      sendMessage(data);
      //get all chats
      // Chat.find({}, (err, chats) => {
      //   console.log(chats);
      socketIO.emit("message-receive", { chat: data });
      // });
    });
  });
};
