const { check, body } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../Middleware/validatorMiddleware");
const Category = require("../../Models/CategoryModel");
exports.getProductValidator = [
  //1- rules
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  //2 - middleware => catch the errors from rules if exist ****this logic in ({validatorMiddleware.js})
  validatorMiddleware,
];
exports.createProductValidator = [
  //1-rules
  check("title")
    .notEmpty()
    .withMessage("Product Name is Required!")
    .isLength({ min: 3 })
    .withMessage("The Name Of Product is Too Short!")
    .isLength({ max: 100 })
    .withMessage("The Name Of Product is Too Long!"),

  check("productType").notEmpty().withMessage("Please select Product Type."),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Product description must be more than 20 characters")
    .isLength({ max: 2000 })
    .withMessage("Product description must be less than 2000 characters"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a Number"),

  check("sold")
    .isNumeric()
    .withMessage("Product sold must be a Number")
    .optional(),

  check("price")
    .isNumeric()
    .withMessage("Price must be a Number")
    .notEmpty()
    .withMessage("Product price is required")
    .isLength({ max: 10 })
    .withMessage("Product price must be less than 10 Numbers"),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("PriceAfterDiscount must be a Number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("PriceAfterDiscount must be less than Price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Product colors must be an Array of Strings"),

  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Product images must be an Array of Strings"),

  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid ID Format")
    //Check if we have a category already defined in the database
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          // throw new Error("Could not find the category");
          return Promise.reject(new Error("Could not find the category"));
        }
      }),
    ),
  check("ratingsAvrage")
    .optional()
    .isNumeric()
    .withMessage("RatingsAvrage must be a Number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be 5.0 or less than 5.0"),

  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("RatingsQuantity must be a Number"),

  body("title").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  //1- rules
  check("id").isMongoId().withMessage("Invalid Product ID Format"),
  //2 - middleware => catch the errors from rules if exist ****this logic in ({validatorMiddleware.js})
  validatorMiddleware,
];
