const mongoose = require("mongoose");
const Schema = mongoose.schema;
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Model = mongoose.model("Post", postSchema);
module.exports = Model;
