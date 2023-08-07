const { check } = require("express-validator");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const Review = require("../../Models/ReviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid ID Format"),
  //2 - middleware => catch the errors from rules if exist ****this logic in ({validatorMiddleware.js})
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Rating Value is Required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating Value Must Be between 1 and 5"),

  check("user").isMongoId().withMessage("Invalid User ID Format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid Product ID Format")
    .custom((val, { req }) => {
      //1-Check if logged user create review before
     return Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You Already have a review before"),
            );
          }
        },
      );
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID Format")
    .custom((val, { req }) => {
    return  Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("No Review found"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You Are Not Allowed To Update This Review"),
          );
        }
      });
    }),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID Format")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error("No Review found"));
          }
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("You are not allowed to update this review"),
            );
          }
        });
      }
      return true;
    }),
  validatorMiddleware,
];
