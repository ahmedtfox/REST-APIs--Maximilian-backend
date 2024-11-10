const Post = require("../model/post");
const removeFile = require("../middlewares/removeFile");
const User = require("../model/user");

exports.getPosts = async (req, res, next) => {
  try {
    const limit = req.query.limit || 4;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const posts = await Post.find({}, { __v: false })
      .populate("creator")
      .limit(limit)
      .skip(skip);
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
    return next(err);
  }
  imageUrl = req.file.path;

  const newPost = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId,
  });
  try {
    const result = await newPost.save();
    const user = await User.findById(req.userId);
    user.posts.push(result);
    const updateUser = await user.save();
    res.status(201).json({
      message: "post created successfully!",
      post: result,
      creator: { _id: user._id, name: user.name },
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

  if (req.uploadStatus === "wrong file type") {
    const err = new Error(req.uploadStatus);
    err.statusCode = 422;
    return next(err);
  }

  try {
    const post = await Post.findOne({ _id: postId });
    const postCreatorId = post.creator.toString() || "";
    if (postCreatorId !== req.userId) {
      const err = new Error("not authorized!");
      err.statusCode = 422;
      return next(err);
    }
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
    const post = await Post.findById(postId);
    if (!post) {
      const err = new Error("post not found!");
      err.statusCode = 422;
      return next(err);
    }
    const user = await User.findById(req.userId);
    const postCreatorId = post.creator.toString() || "";
    if (postCreatorId !== req.userId) {
      const err = new Error("not authorized!");
      err.statusCode = 422;
      return next(err);
    }
    const result = await Post.findByIdAndDelete(postId);
    const updatedPosts = user.posts.filter((p) => {
      return p.toString() !== postId;
    });
    user.posts = updatedPosts;
    // this is another method in mongoose
    //  user.posts.pull(postId);
    const updateUser = await user.save();
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

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("not authorized!");
      err.statusCode = 422;
      return next(err);
    }
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.updateStatus = async (req, res, next) => {
  try {
    const newStatus = req.body.status || "active";
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("not authorized!");
      err.statusCode = 422;
      return next(err);
    }
    user.status = newStatus;
    const result = await user.save();
    res.status(200).json({
      msg: "status successfully updated ",
      updatedStatus: result.status,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
