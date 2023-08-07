const express = require("express");

const {
  createReview,
  getAllReviews,
  getReviewById,
  deleteReview,
  updateReview,
  createFilterObject,
  setProductAndUserIdToBody,
} = require("../Services/ReviewService");
const {
  deleteReviewValidator,
  updateReviewValidator,
  createReviewValidator,
  getReviewValidator
} = require("../Utils/validators/ReviewValidator");
const router = express.Router({ mergeParams: true });
const Authorization = require("../Services/authService");

router.route("/").get(createFilterObject,getAllReviews).post(
  Authorization.protect,
  Authorization.allowedTo("user"),
  setProductAndUserIdToBody,
  createReviewValidator,
  createReview,
);
router
  .route("/:id")
  .get(getReviewValidator,getReviewById)
  .delete(
    Authorization.protect,
    Authorization.allowedTo("manager", "user", "admin"),
    deleteReviewValidator,
    deleteReview,
  )
  .put(
    Authorization.protect,
    Authorization.allowedTo("user"),
    updateReviewValidator,
    updateReview,
  );
module.exports = router;
