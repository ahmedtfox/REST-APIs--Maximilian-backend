const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const isAuth = require("../middlewares/is-auth");
const upload = require("../utils/uploadFiles");
const {
  validateUser,
  handleValidationErrors,
} = require("../middlewares/validation");

router.post(
  "/signup",
  validateUser,
  handleValidationErrors,
  authController.signup
);

router.post("/login", authController.login);
router.get("/status", isAuth, authController.getStatus);
module.exports = router;
