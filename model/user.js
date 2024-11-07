const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userSchema = new schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Object,
      default: "i am new",
    },
    posts: [{ type: schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: false,
  }
);
const Model = mongoose.model("User", userSchema);
module.exports = Model;
