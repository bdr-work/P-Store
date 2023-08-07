const factory = require("./handlerFactory");

const Coupon = require("../Models/CouponModel");

//GET All Coupons
//@desc get all Coupons
//@Route  GET /api/v1/coupons
//@access Private Admin
exports.getAllCoupons = factory.getAll(Coupon);
//----------------------------------------------------------------------
//GET Specific Coupon by id
//@desc Specific Coupon by id
//@Route  GET /api/v1/coupons/couponId
//@access PUBLIC all Users
exports.getCouponById = factory.getOne(Coupon);
//----------------------------------------------------------------------
//GET update Coupon by id
//@desc update Coupon by id
//@Route  GET /api/v1/coupons/CouponId
//@access Private
exports.updateCoupon = factory.updateOne(Coupon);
//----------------------------------------------------------------------
//Delete Specific Coupon by id
//@desc delete Specific Coupon by id
//@Route  DELETE /api/v1/Coupons/CouponId
//@access Private
exports.deleteCoupon = factory.deleteOne(Coupon);
//----------------------------------------------------------------------
exports.createCoupon = factory.createOne(Coupon);