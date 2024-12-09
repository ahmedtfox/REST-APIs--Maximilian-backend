import express from "express";
import feedController from "../controllers/feed.js";
import upload from "../utils/uploadFiles.js";
import {
  validatePost,
  validateStatus,
  handleValidationErrors,
} from "../middlewares/validation.js";
import isAuth from "../middlewares/is-auth.js";

const feedRoute = express.Router();
feedRoute.get("/posts", isAuth, feedController.getPosts);
feedRoute.get("/posts/:postId", isAuth, feedController.getPost);
feedRoute.post(
  "/post",
  isAuth,
  upload.single("image"),
  validatePost,
  handleValidationErrors,
  feedController.createPost
);

feedRoute.put(
  "/posts/:postId",
  isAuth,
  validatePost,
  handleValidationErrors,
  feedController.updatePost
);

feedRoute.delete("/posts/:postId", isAuth, feedController.deletePost);

feedRoute.patch(
  "/status",
  isAuth,
  validateStatus,
  handleValidationErrors,
  feedController.updateStatus
);

export default feedRoute;
