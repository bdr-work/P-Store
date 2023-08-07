const express = require("express");

const {
 getAllCoupons,
 getCouponById,
 updateCoupon,
 deleteCoupon,
 createCoupon
} = require("../Services/CouponService");
const Authorization = require("../Services/authService");

const router = express.Router();
router.use(Authorization.protect,Authorization.allowedTo("admin","manager"));
// .
// .
// .
//----------------------------------------------------------------------
//Routes
router.route("/").post(createCoupon).get(getAllCoupons);

router.route("/:id").get(getCouponById).delete(deleteCoupon).put(updateCoupon);

module.exports = router;
