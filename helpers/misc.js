const Chat = require("../models/chat.model");

const addUser = ({ receiverEmail, senderEmail, chatID }, socket) => {
  console.log(receiverEmail, senderEmail);
  if (!receiverEmail || !senderEmail) {
    return { error: "You tried adding a zero chat" };
  }
  const users = { receiverEmail, senderEmail };
  Chat.aggregate([
    {
      $match: { receiverEmail, senderEmail },
    },
  ]).then((chat) => {
    console.log(chat);
    if (chat.length > 0) {
      socket.emit("openChat", { ...chat[0] });
    } else {
      Chat.aggregate([
        { $match: { receiverEmail: senderEmail, senderEmail: receiverEmail } },
      ]).then((lastAttempt) => {
        // new Chat({
        //   sendersEmail: senderEmail,
        //   receiversEmail: receiverEmail,
        //   chatID: chatID,
        // }).save();
        console.log("lastAttempt");
        console.log(lastAttempt);
        //     if (lastAttempt.length > 0) {
        //       socket.emit("openChat", { ...lastAttempt[0] });
        //     } else {
        //       const newChat = {
        //         ...users,
        //         chatID: chatID,
        //       };
        //       socket.emit("openChat", { ...newChat });
        //       new Chat({
        //         ...users,
        //         chatID: chatID,
        //       }).save();
        //     }
      });
    }
  });
};
module.exports = addUser;
