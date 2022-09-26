require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("https");
const server = http.createServer(app);
const socketIO = require("socket.io")(server);
const db = "mongodb://localhost:27017/brainworld_db";
require("./config/mongo.js")(db);

app.use(cors());
app.use(express.json()); //making sure the server can use json, this is use to make the app able to use json
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", require("./routes/user.route"));
app.use("/post", require("./routes/posts.route"));

require("./middleware/socket")(app, socketIO, db);

server.listen(port, () => {
  console.log(`Listening on port:: http://localhost:${port}/`);
});