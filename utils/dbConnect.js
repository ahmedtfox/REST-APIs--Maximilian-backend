import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config(); // Load .env file
const db_rrl = process.env.DB_URL;

const dbConnect = async (databaseName, option) => {
  try {
    await mongoose.connect(db_rrl, { dbName: databaseName });
    if (option === "console") {
      console.log(`connected to ${databaseName} database successfully`);
    }
  } catch (err) {
    console.log(err);
  }
};
const dbDisconnect = async () => {
  try {
    await mongoose.disconnect();
    return `disconnected successfully`;
  } catch (err) {
    console.log(err);
  }
};
export { dbConnect, dbDisconnect };
