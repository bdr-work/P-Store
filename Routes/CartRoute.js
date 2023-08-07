const express = require("express");

const {
 addProductToCart,
 getLoggedUserCart,
 updateQuantity,
 removeSpecificItem,
 clearLoggeUserCart,
 applyCouponCode
} = require("../Services/CartService");
const Authorization = require("../Services/authService");

const router = express.Router();
router.use(Authorization.protect,Authorization.allowedTo("user"));
// .
// .
// .
//----------------------------------------------------------------------
//Routes
router.route("/").post(addProductToCart).get(getLoggedUserCart).delete(clearLoggeUserCart);
router.put("/applycoupon",applyCouponCode)
router.route("/:itemId").put(updateQuantity).delete(removeSpecificItem)

module.exports = router;
