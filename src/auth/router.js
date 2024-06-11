import express from "express";
import { register_user, verify } from "./register.js";
import {
  loginUserValidationRules,
  registerUserValidationRules,
} from "./validator.js";
import { login } from "./login.js";

export const AuthRouter = express.Router();

AuthRouter.post("/register", registerUserValidationRules, register_user);
AuthRouter.post("/verify", verify);
AuthRouter.post("/login", loginUserValidationRules, login);
