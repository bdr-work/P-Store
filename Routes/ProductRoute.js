const express = require("express");

const {
  createProduct,
  getAllProducts,
  getOne,
  updateOne,
  deleteOne,
  createFilterObject,
  uploadImages,
  resizeImageBySharp,
} = require("../Services/ProductService");
const {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../Utils/validators/ProductValidator");
const Authorization = require("../Services/authService");
const router = express.Router();
const reviewsRoute = require("../Routes/ReviewRoute")
router.use("/:productId/reviews", reviewsRoute)

router
  .route("/")
  .post(
    Authorization.protect,
    Authorization.allowedTo("admin", "manager"),
    uploadImages,
    resizeImageBySharp,
    createProductValidator,
    createProduct,
  )
  .get(createFilterObject, getAllProducts);

router
  .route("/:id")
  .get(getProductValidator, getOne)
  .put(
    Authorization.protect,
    Authorization.allowedTo("admin", "manager"),
    uploadImages,
    resizeImageBySharp,
    updateProductValidator,
    updateOne,
  )
  .delete(
    Authorization.protect,
    Authorization.allowedTo("admin", "manager"),
    deleteProductValidator,
    deleteOne,
  );

module.exports = router;
