const { body, validationResult } = require("express-validator");

// Validation rules for creating a post
const validatePost = [
  body("title")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long."),
  body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters long."),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
  } else {
    const err = new Error("validation failed");
    err.statusCode = 422;
    err.errorDetails = result.array();
    /*     throw err; */
    return next(err);
  }
};

module.exports = {
  validatePost,
  handleValidationErrors,
};
