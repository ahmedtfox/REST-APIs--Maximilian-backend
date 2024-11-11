const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();
const feedRoute = require("./routes/feed");
const authRoute = require("./routes/auth");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const removeFile = require("./middlewares/removeFile");
const moment = require("moment");
const { Socket } = require("socket.io");
const socket = require("./socket");
const isAuth = require("./middlewares/is-auth");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.use("/feed/images", isAuth, express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-mETHODS",
    "OPTIONS,GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.use("/feed", feedRoute);
app.use("/auth", authRoute);

//error handling
app.use((error, req, res, next) => {
  error.time = moment().format("HH:mm:SS");
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const errorDetails = error.errorDetails || undefined;
  if (req.uploadStatus === "success") {
    removeFile(req.file.filename);
  }
  return res.status(statusCode).json({
    message: message,
    errorDetails,
  });
});
let server, io;
const PORT = process.env.PORT;
const db_rrl = process.env.DB_URL;

mongoose
  .connect(db_rrl, { dbName: "REST-APIs-Maximilian-course" })
  .then((result) => {})
  .catch((err) => {
    console.log(err);
  });

mongoose
  .connect(db_rrl, { dbName: "REST-APIs-Maximilian-course" })
  .then((result) => {
    console.log("connected to db successfully");
  })
  .catch((err) => {
    console.log(err);
  });

server = app.listen(PORT, () => {
  console.log("Listening to port:" + PORT);
});
io = require("./socket").init(server);
io.on("connection", (socket) => {
  console.log("Client connected");
  io.emit("on connection", "hi");
  socket.on("msg", (msg) => {
    console.log(msg);
  });
});
