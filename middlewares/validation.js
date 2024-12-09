import { body, validationResult } from "express-validator";
// Validation rules for creating a post
export const validatePost = [
  body("title")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Title must be at least 5 characters long."),
  body("content")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Content must be at least 5 characters long."),
];

export const validateUser = [
  body("email").isEmail().withMessage("Please enter a valid email."),
  body("name")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters long."),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long."),
];

export const validateStatus = [
  body("status")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a valid status."),
];

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
  } else {
    const err = new Error("validation failed");
    err.statusCode = 422;
    err.errorDetails = result.array();
    return next(err);
  }
};
