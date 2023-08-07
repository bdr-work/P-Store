const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const User = require("../../Models/UserModel");
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
const bcrypt = require("bcryptjs");

exports.createUserValidator = [
  //1-rules
  check("name")
    .notEmpty()
    .withMessage("User Required!")
    .isLength({ min: 3 })
    .withMessage("The Name Of User is Too Short!"),
  body("name").custom((val, { req }) => {
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
    .withMessage("Phone Required!")
    .custom((val) =>
      User.findOne({ phone: val }).then((user) => {
        if (user) {
          Promise.reject(new ApiError("Phone Number is already in use"));
        }
      }),
    ),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  //1-rules
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("E-mail already in use"));
        }
      }),
    ),
  check("phone")
    .optional()
    .isMobilePhone("ar-SA")
    .withMessage("Invalid phone number only accepted SA Phone numbers")
    .custom((val) =>
      User.findOne({ phone: val }).then((user) => {
        if (user) {
          Promise.reject(new ApiError("Phone Number is already in use"));
        }
      }),
    ),

  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  //1- rules
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  //2 - middleware => catch the errors from rules if exist ****this logic in ({validatorMiddleware.js})
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User ID Format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("You must enter a current password"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("Please enter password confirmation"),
  check("password")
    .notEmpty()
    .withMessage("Please enter your new password")
    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user) {
        throw new Error("This is no user for this id");
      }
      //Verify current user Password is currect
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password,
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      if (val !== req.body.passwordConfirm) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateUserLoggedValidator = [
  //1-rules
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("The Name Of User is Too Short!")
    .isLength({ max: 32 })
    .withMessage("The Name Of User is Too Long!"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid Email")
    .custom((val) =>
      User.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("This email is already in use"));
        }
      }),
    ),
  check("phone")
    .isMobilePhone("ar-SA")
    .withMessage("Phone Number be SA phone number")
    .optional(),

  validatorMiddleware,
];
