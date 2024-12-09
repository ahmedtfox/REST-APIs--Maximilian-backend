import Post from "../model/post.js";
import removeFile from "../utils/removeFile.js";
import User from "../model/user.js";
import io from "../socket.js";

const getPosts = async (req, res, next) => {
  try {
    const limit = req.query.limit || 4;
    const page = req.query.page || 1;
    const skip = (page - 1) * limit;
    const posts = await Post.find({}, { __v: false })
      .populate("creator")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    if (!posts) {
      const error = new Error("posts not found");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({ posts });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId, { __v: false });
    if (!post) {
      const error = new Error("post not found");
      error.statusCode = 400;
      throw error;
    }
    res.status(200).json({ message: "post fetched", post });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = "";

    if (req.uploadStatus === "wrong file type") {
      const error = new Error(req.uploadStatus);
      error.statusCode = 422;
      throw error;
    }
    imageUrl = req.file.path;

    const newPost = new Post({
      title,
      content,
      imageUrl,
      creator: req.userId,
    });
    const result = await newPost.save();
    const user = await User.findById(req.userId);
    user.posts.push(result);
    const updateUser = await user.save();
    io.getIO().emit("posts", {
      action: "create",
      post: {
        ...result._doc,
        creator: {
          _id: req.userId,
          name: user.name,
        },
      },
    });
    res.status(201).json({
      message: "post created successfully!",
      post: result,
      creator: { _id: user._id, name: user.name },
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    let title = req.body.title;
    let content = req.body.content;
    let imageUrl;

    if (req.uploadStatus === "wrong file type") {
      const err = new Error(req.uploadStatus);
      err.statusCode = 422;
      throw err;
    }

    const post = await Post.findById(postId).populate("creator");
    console.log(post);
    const postCreatorId = post.creator._id.toString() || "";
    if (postCreatorId !== req.userId) {
      const err = new Error("Not authorized!");
      err.statusCode = 422;
      throw err;
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
      throw err;
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

    io.getIO().emit("posts", {
      action: "update",
      post: {
        ...result._doc,
        creator: {
          name: post.creator.name,
          id: post.creator._id,
        },
      },
    });

    res.status(200).json({
      message: "post updated successfully!",
      post: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      const err = new Error("post not found!");
      err.statusCode = 422;
      throw err;
    }
    const user = await User.findById(req.userId);
    const postCreatorId = post.creator.toString() || "";
    if (postCreatorId !== req.userId) {
      const err = new Error("not authorized!");
      err.statusCode = 422;
      throw err;
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

    io.getIO().emit("posts", { action: "delete", post: postId });
    res.status(200).json({
      message: "post deleted successfully!",
      post: result,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const newStatus = req.body.status || "active";
    const user = await User.findById(req.userId);
    if (!user) {
      const err = new Error("not authorized!");
      err.statusCode = 422;
      throw err;
    }
    user.status = newStatus;
    const result = await user.save();
    res.status(200).json({
      msg: "status successfully updated ",
      updatedStatus: result.status,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

export default {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
  updateStatus,
};
