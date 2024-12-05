const mongoose = require("mongoose");
require("dotenv").config();
const db_rrl = process.env.DB_URL;

const dbConnect = async (databaseName) => {
  try {
    await mongoose.connect(db_rrl, { dbName: databaseName });
    console.log(`connected to ${databaseName} successfully`);
  } catch (err) {
    console.log(err);
  }
};
module.exports = dbConnect;
