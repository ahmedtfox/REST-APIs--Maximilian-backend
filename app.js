const express = require("express");
const path = require("path");
require("dotenv").config();
const feedRoute = require("./routes/feed");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-mETHODS",
    "OPTIONS,GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  console.log("request");
  next();
});

app.use(feedRoute);

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