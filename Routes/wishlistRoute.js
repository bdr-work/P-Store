const express = require("express");

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../Services/WishlistService");
const Authorization = require("../Services/authService")

const router = express.Router();
router.use(Authorization.protect, Authorization.allowedTo("user"));
// .
// .
// .
//----------------------------------------------------------------------
//Routes
router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete("/:productId", removeProductFromWishlist);

module.exports = router;
