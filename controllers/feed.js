const { validationResult } = require("express-validator");
const Post = require("../model/post");

exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}, { __v: false });
    if (!posts) {
      const error = new Error("post not found");
      error.statusCode = 400;
      return next(error);
    }
    res.status(200).json({ posts });
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  console.log(postId);
  try {
    const post = await Post.findById(postId, { __v: false });
    if (!post) {
      const error = new Error("post not found");
      error.statusCode = 400;
      return next(error);
    }
    res.status(200).json({ message: "post fetched", post });
  } catch (error) {
    error.statusCode = 500;
    return next(error);
  }
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
