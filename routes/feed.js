const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feed");

const { body } = require("express-validator");
router.get("/posts", feedController.getPosts);
router.get("/posts/:postId", feedController.getPost);
router.post(
  "/post",
  [
    body("title")
      .trim()
      .isLength({ min: 5 })
      .withMessage("title must be more than 5 characters"),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

module.exports = router;

/* 
 [
    body("title").trim().isLength({ min: 5 }),
    body("content").isString().withMessage("not string"),
  ],
*/
