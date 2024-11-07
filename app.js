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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  console.log(req.body);
  console.log(req.method);
  console.log(req.params);
  console.log(req.url);
  console.log(req.query);
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

const PORT = process.env.PORT;
const db_rrl = process.env.DB_URL;

mongoose
  .connect(db_rrl, { dbName: "REST-APIs-Maximilian-course" })
  .then((result) => {
    app.listen(PORT, () => {
      console.log("Listening to port:" + PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
