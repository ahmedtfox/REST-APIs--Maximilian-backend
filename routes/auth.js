const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
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

module.exports = router;
