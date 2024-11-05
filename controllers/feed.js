const { validationResult } = require("express-validator");
const Post = require("../model/post");
exports.getPosts = (req, res, next) => {
  const posts = [
    {
      _id: "44455sd5sjyjyjsdsds",
      title: "First Post",
      content: "This is the first post!",
      imageUrl: "images/77.jpg",
      creator: {
        name: "ahmed",
      },
      createdAt: new Date(),
    },
  ];
  res.status(200).json(posts);
};
exports.createPost = async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = "images/77.jpg";
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const err = new Error("validation failed");
    err.statusCode = 422;
    err.errorDetails = result.array();
    /*     throw err; */
    return next(err);
  }

  const newPost = new Post({
    title,
    content,
    imageUrl: "images/77.jpg",
    creator: {
      name: "ahmed",
    },
  });
  try {
    const result = await newPost.save();
    res.status(201).json({
      message: "post created successfully!",
      post: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
