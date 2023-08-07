const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
 name:{
  type: String,
trime: true,
  required: [true, "Coupon Name Required"],
  unique: true,
 },
 expire:{
  type: Date,
  required: [true, "Coupon expiration Date Required"],
 },
 discount:{
  type: Number,
  required:[true, "Coupon discount Amount Required"],
 }
 
},{timestamps:true});


module.exports = mongoose.model('Coupon', CouponSchema);