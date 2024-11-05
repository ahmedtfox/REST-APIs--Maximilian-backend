const mongoose = require("mongoose");
const schema = mongoose.Schema;
const postSchema = new schema(
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
