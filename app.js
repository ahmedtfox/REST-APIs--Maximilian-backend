import express from "express";
const app = express();
import path from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config(); // Load .env file
import feedRoute from "./routes/feed.js";
import authRoute from "./routes/auth.js";
import cors from "cors";
import { dbConnect } from "./utils/dbConnect.js";
import removeFile from "./utils/removeFile.js";
import moment from "moment";
import { Server as Socket } from "socket.io"; // Assuming you are using `socket.io` Server
import socket from "./socket.js";
import isAuth from "./middlewares/is-auth.js";
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.use(
  "/feed/images",
  isAuth,
  express.static(path.join(import.meta.dirname, "images"))
);

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
const PORT = process.env.PORT || 5000;

/* dbConnect("REST-APIs-Maximilian-course").then((result) => {
  console.log(result);
}); */

dbConnect("REST-APIs-Maximilian-course", "console");

server = app.listen(PORT, () => {
  console.log("Listening to port:" + PORT);
});
import ss from "./socket.js";
io = ss.init(server);
io.on("connection", (socket) => {
  console.log("Client connected");
  io.emit("on connection", "hi");
  socket.on("msg", (msg) => {
    console.log(msg);
  });
});
