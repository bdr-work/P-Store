const express = require("express");

const {
  createCategory,
  getAllCategories,
  getOne,
  updateOne,
  deleteOne,
} = require("../Services/CategoryService");
const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../Utils/validators/categoryValidator");

const Authorization = require("../Services/authService");

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(
    Authorization.protect,
    Authorization.allowedTo("admin", "manager"),
    createCategoryValidator,
    createCategory,
  );
router
  .route("/:id")
  .get(getCategoryValidator, getOne)
  .put(
    Authorization.protect,
    Authorization.allowedTo("admin", "manager"),
    updateCategoryValidator,
    updateOne,
  )
  .delete(
    Authorization.protect,
    Authorization.allowedTo("admin", "manager"),
    deleteCategoryValidator,
    deleteOne,
  );
module.exports = router;
