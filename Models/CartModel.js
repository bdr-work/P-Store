const mongoose  = require("mongoose");

const cartSchema = new mongoose.Schema({
cartItems:[{
  product:{
    type: mongoose.Types.ObjectId,
    ref:"Product",
  },
  quantity: {type:Number,default:1},
  price:Number,
  color:String,
},
],
totalCartPrice: Number,
totalCartPriceAfterDiscount: Number,
user:{
 type: mongoose.Types.ObjectId,
 ref:"User",
}
},{timestamps:true});

module.exports = mongoose.model("Cart",cartSchema);