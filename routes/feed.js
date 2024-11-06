const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feed");
const upload = require("../utils/uploadFiles");
const {
  validatePost,
  handleValidationErrors,
} = require("../middlewares/validation");
router.get("/posts", feedController.getPosts);
router.get("/posts/:postId", feedController.getPost);
router.post(
  "/post",
  upload.single("image"),
  validatePost,
  handleValidationErrors,
  feedController.createPost
);

router.put(
  "/posts/:postId",
  /*   validatePost,
  handleValidationErrors, */
  feedController.updatePost
);

module.exports = router;