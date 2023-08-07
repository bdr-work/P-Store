const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const User = require("../../Models/UserModel");

exports.signupUserValidator = [
  //1-rules
  check("name")
    .notEmpty()
    .withMessage("User Required!")
    .isLength({ min: 3 })
    .withMessage("The Name Of User is Too Short!")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email Required!")
    .isEmail()
    .withMessage("Invalid Email")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("This email is already in use"));
        }
      }),
    ),
  check("password")
    .notEmpty()
    .withMessage("Password is Required!")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Password Confirmation is Required!"),

  check("phone")
    .isMobilePhone("ar-SA")
    .withMessage("Phone Number be SA phone number")
    .notEmpty()
    .withMessage("Phone Required!"),

  validatorMiddleware,
];

exports.loginUserValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Required!")
    .isEmail()
    .withMessage("Invalid Email"),
  check("password")
    .notEmpty()
    .withMessage("Password is Required!")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validatorMiddleware,
];
