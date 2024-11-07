const Post = require("../model/post");
const removeFile = require("../middlewares/removeFile");

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
  let imageUrl = "";

  if (req.uploadStatus === "wrong file type") {
    const err = new Error(req.uploadStatus);
    err.statusCode = 422;
    /*     throw err; */
    return next(err);
  }
  imageUrl = req.file.path;

  const newPost = new Post({
    title,
    content,
    imageUrl,
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

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  let title = req.body.title;
  let content = req.body.content;
  let imageUrl;
  console.log(title, content);

  if (req.uploadStatus === "wrong file type") {
    const err = new Error(req.uploadStatus);
    err.statusCode = 422;
    /*     throw err; */
    return next(err);
  }

  try {
    const post = await Post.findOne({ _id: postId });
    if (title === post.title) {
      title = undefined;
    }
    if (content === post.content) {
      content = undefined;
    }

    if (req.file) {
      removeFile(undefined, post.imageUrl);
      imageUrl = req.file.path;
    }
    if (!(title || content || imageUrl)) {
      const err = new Error("no changes");
      err.statusCode = 422;
      /*     throw err; */
      return next(err);
    }
    const result = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        content,
        imageUrl,
      },
      { new: true }
    );

    let formattedCreatedAt = result.formattedCreatedAt;
    result._doc["formattedCreatedAt"] = formattedCreatedAt;
    let formattedUpdatedAt = result.formattedUpdatedAt;
    result._doc["formattedUpdatedAt"] = formattedUpdatedAt;

    res.status(200).json({
      message: "post updated successfully!",
      post: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const result = await Post.findByIdAndDelete(postId);
    if (!result) {
      const err = new Error("post not found!");
      err.statusCode = 422;
      /*     throw err; */
      return next(err);
    }
    removeFile(undefined, result.imageUrl);
    res.status(200).json({
      message: "post deleted successfully!",
      post: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
