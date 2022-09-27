// const { addUser } = require("../helpers/misc");
// const Messages = require("../schema/Messages");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const addUser = require("../helpers/misc");
const sendMessage = require("../controllers/chat.controller");
const Chat = require("../models/chat.model");

module.exports = (app, socketIO, db) => {
  //   io.on("connection", function (socket) {

  //   })
  socketIO.on("connection", (client) => {
    console.log("Connection Successfully", client.id);

    client.on("disconnect", () => {
      console.log("Disconnected Successfully");
    });

    client.on("_getUsers", ({ senderEmail }) => {
      User.find({}, (err, users) => {
        console.log(users);
        socketIO.emit("_allUsers", users);
      }).select("-password"); //get all users and remove the password
    });

    // socket.on("_getAllChats", ({ chatID }) => {
    //   Chat.find({ chatID: chatID }, (err, chats) => {
    //     // console.log(chatID);
    //     // console.log(chats);
    //     socketIO.emit("_allChats", chats);
    //   }); //get all users and remove the password
    // });

    client.on("sendMessage", ({ data: data, chatID: chatID }) => {
      if (data === null) {
        //get all chats
        Chat.find({ chatID: chatID }, (err, chats) => {
          // console.log("chatsup");
          // console.log(chats);
          socketIO.emit("_getAllChats", { chats: chats });
        });
      } else {
        console.log("message Successfully", data.sendersid);
        sendMessage(data);
        Chat.find({ chatID: chatID }, (err, chats) => {
          // console.log("chatsdown");
          // console.log(chats);

          socketIO.emit("_getAllChats", { chats: [data] });
        });
      }
    });

    client.on("postReaction", () => {
      Post.find({}, (err, posts) => {
        console.log(posts);
        socketIO.emit("getAllPost", posts);
      }); //get all users and remove the password
    });
  });
};
