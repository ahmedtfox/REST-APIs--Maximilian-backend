const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feed");
const upload = require("../utils/uploadFiles");
const {
  validatePost,
  handleValidationErrors,
} = require("../middlewares/validation");

const isAuth = require("../middlewares/is-auth");

router.get("/posts", isAuth, feedController.getPosts);
router.get("/posts/:postId", isAuth, feedController.getPost);
router.post(
  "/post",
  isAuth,
  upload.single("image"),
  validatePost,
  handleValidationErrors,
  feedController.createPost
);

router.put(
  "/posts/:postId",
  isAuth,
  validatePost,
  handleValidationErrors,
  feedController.updatePost
);

router.delete("/posts/:postId", isAuth, feedController.deletePost);

module.exports = router;
