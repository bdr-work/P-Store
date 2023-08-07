const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");

exports.getCategoryValidator = [
  //1- rules
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  //2 - middleware => catch the errors from rules if exist ****this logic in ({validatorMiddleware.js})
  validatorMiddleware,
];

exports.createCategoryValidator = [
  //1-rules
  check("name")
    .notEmpty()
    .withMessage("Category Name is Required!")

    .isLength({ min: 3 })
    .withMessage("The Name Of Category is Too Short!")

    .isLength({ max: 32 })
    .withMessage("The Name Of Category is Too Long!"),

  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
exports.updateCategoryValidator = [
  //1-rules
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  check("name")
    .notEmpty()
    .withMessage("Category Name Required!")

    .isLength({ min: 3 })
    .withMessage("The Name Of Category is Too Short!")

    .isLength({ max: 32 })
    .withMessage("The Name Of Category is Too Long!"),

  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteCategoryValidator = [
  //1- rules
  check("id").isMongoId().withMessage("Invalid Category ID Format"),
  //2 - middleware => catch the errors from rules if exist ****this logic in ({validatorMiddleware.js})
  validatorMiddleware,
];
