import express from "express";
import authController from "../controllers/auth.js";
import isAuth from "../middlewares/is-auth.js";

const authRoute = express.Router();

import {
  validateUser,
  handleValidationErrors,
} from "../middlewares/validation.js";
authRoute.post(
  "/signup",
  validateUser,
  handleValidationErrors,
  authController.signup
);

authRoute.post("/login", authController.login);
authRoute.get("/status", isAuth, authController.getStatus);

export default authRoute;
