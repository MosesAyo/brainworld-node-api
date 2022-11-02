// const { addUser } = require("../helpers/misc");
// const Messages = require("../schema/Messages");
const User = require("../models/user.model");
const Post = require("../models/post.model");
const addUser = require("../helpers/misc");
const sendMessage = require("../controllers/chat.controller");
const Chat = require("../models/chat.model");

module.exports = (app, socketIO, db) => {
  socketIO.on("connection", (client) => {
    console.log("Connection Successfully", client.id);

    client.on("disconnect", () => {
      console.log("Disconnected Successfully");
    });

    client.on("_getUsers", ({ senderEmail }) => {
      User.find({}, (err, users) => {
        // console.log(users);
        socketIO.emit("_allUsers", users);
      }).select("-password"); //get all users and remove the password
    });

    client.on("sendMessage", async ({ data: data, chatID: chatID }) => {
      if (data === null) {
        //get all chats
        Chat.find({ chatID: chatID }, (err, chats) => {
          // console.log("chatsup");
          // console.log(chats);
          socketIO.emit("_getAllChats", { chats: chats });
        });
      } else {
        console.log("message Successfully", data.sendersid);
        // await sendMessage(data, chatID);
        const newChat = new Chat({
          sendersid: data.sendersid,
          sendersEmail: data.senderEmail,
          receiverEmail: data.receiverEmail,
          messageText: data.messageText,
          chatID: chatID,
          sentAt: data.sentAt,
        });
        await newChat.save();
        var chats = await Chat.find({ chatID: chatID }).lean();

        socketIO.emit("_getAllChats", { chats: chats });
      }
    });

    // client.on("postReaction", ({postReaction}) => {

    //   Post.find({}, (err, posts) => {
    //     console.log(posts);
    //     socketIO.emit("getAllPost", posts);
    //   }); //get all users and remove the password
    // });
  });
  socketIO.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
};
// 07065227552;
