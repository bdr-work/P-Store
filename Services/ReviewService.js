const Review = require("../Models/ReviewModel");
const factory = require("./handlerFactory");


//Nested Route
//Get /api/v1/pstore/products/productId/reviews
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};
//GET All Reviews
//@desc get all Reviews
//@Route  GET /api/v1/reviews
//@access PUBLIC all Users
exports.getAllReviews = factory.getAll(Review);
//----------------------------------------------------------------------
//GET Specific Review by id
//@desc Specific Review by id
//@Route  GET /api/v1/reviews/ReviewId
//@access PUBLIC all Users
exports.getReviewById = factory.getOne(Review);
//----------------------------------------------------------------------
//GET update Review by id
//@desc update Review by id
//@Route GET /api/v1/reviews/ReviewId
//@access Private Only,logged users
exports.updateReview = factory.updateOne(Review);
//----------------------------------------------------------------------
//Delete Specific Brand by id
//@desc delete Specific Brand by id
//@Route  DELETE /api/v1/reviews/ReviewId
//@access Private Only,logged users, Admin ,manager
exports.deleteReview = factory.deleteOne(Review);
//------------------------------------------------------------------------
//@desc Create brand
//@Route  POST /api/v1/reviews/ReviewId
//@access Private Only,logged users
exports.setProductAndUserIdToBody = (req, res, next) => {
  //Nested Route
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.createReview = factory.createOne(Review);
