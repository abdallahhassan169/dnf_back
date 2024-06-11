import { body } from "express-validator";

export const registerUserValidationRules = [
  body("email").isEmail().withMessage("Email is invalid"),
  body("password")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be at least 6 characters long"),
  body("phone").isMobilePhone().withMessage("Phone number is invalid"),
  body("national_id")
    .isLength({ min: 8, max: 20 })
    .withMessage("National ID must be at least 8 characters long"),

  body("user_name")
    .isLength({ min: 5, max: 50 })
    .withMessage("name must be between 5 and 50 characters "),
];

export const loginUserValidationRules = [
  body("email").isEmail().withMessage("Email is invalid"),
  body("password")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be at least 6 characters long"),
];
