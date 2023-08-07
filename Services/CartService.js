const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/apiError");

const Cart = require("../Models/CartModel");
const Product = require("../Models/ProductModel");
const Coupon = require("../Models/CouponModel");

// .
// .
// .
//----------------------------------------------------------------------
//Calculates the total price of Cart
const calcTotalPrice = (cart)=>{
let totalPrice = 0;
cart.cartItems.forEach((item)=>{
totalPrice += item.price * item.quantity;
cart.totalCartPrice = totalPrice;
})
 return totalPrice;
}
//Add Product to cart
//@desc Add Product to cart
//@Route  Post /api/v1/cart
//@access Private Just logged User
exports.addProductToCart = asyncHandler(async(req, res, next)=>{
    const {productId, color} = req.body;
    
    const product = await Product.findById(productId);
    //Get Cart For Logged User
    let cart = await Cart.findOne({user:req.user._id});
    
    // If The User Dosen't have Cart
    if(!cart){
     //Crate A Cart For Logged User With Products
     cart = await Cart.create({
      user: req.user._id,
      cartItems:[{product:productId, color, price:product.price}]
      });
      
    }else{
      //Product exists in Cart and update quantity
      const productIndex = cart.cartItems.findIndex(
       (item)=> item.product.toString() === productId && item.color === color
      );
      //The Above if one condition is false will return -1
      if(productIndex > -1){
         const cartItem = cart.cartItems[productIndex];
         cartItem.quantity += 1;
         cart.cartItems[productIndex] = cartItem;
      }else{
        cart.cartItems.push({product: productId, color: color, price: product.price})
      }
    }
    
    calcTotalPrice(cart);
    await cart.save();
      res.status(200).json({
    status: "success",
    numberOfCartItems: cart.cartItems.length,
    message: "Product Added To Cart Successfully",
    data: cart,
  });
});
//Get Logged Cart
//@desc Get Logged Cart
//@Route  get /api/v1/cart
//@access Private Just logged User
exports.getLoggedUserCart = asyncHandler(async(req, res, next)=>{
   const cart = await Cart.findOne({user:req.user._id});
   
   if(!cart || cart.cartItems.length === 0){
    return next(new ApiError("Your Cart Is Empty☹️!",404));
   }
   res.status(200).json({numberOfCartItems:cart.cartItems.length, data: cart});
});

//remove item from Logged Cart
//@desc delete item from Logged Cart
//@Route  put /api/v1/cart/:itemId
//@access Private Just logged User
exports.removeSpecificItem= asyncHandler(async(req,res, next)=>{
 const cart = await Cart.findOneAndUpdate({user:req.user._id},
  {$pull: {cartItems:{_id: req.params.itemId}}},
  {new:true}
 );
 if(cart.cartItems.length=== 0 ){
  return next(new ApiError("Your Cart Is Empty☹️!",404));
 }
 
calcTotalPrice(cart);
await cart.save();
res
    .status(200)
    .json({ numberOfCartItems: cart.cartItems.length, data: cart });
});
//Delete logged User Cart
//@desc Delete logged User Cart
//@Route  delete /api/v1/cart
//@access Private Just logged User
exports.clearLoggeUserCart = asyncHandler(async(req,res,next)=>{
 //Clear logged User Cart
 await Cart.findOneAndDelete({user:req.user._id});
 res.status(200).json({ message: "Success" });
})
//Update product quantity
//@desc  Update product quantity
//@Route  put /api/v1/cart/:itemId
//@access Private Just logged User
exports.updateQuantity = asyncHandler(async(req,res,next)=>{
 const {quantity} = req.body;
 
 const cart = await Cart.findOne({user:req.user._id});
 if (!cart) {
    return next(new ApiError("There is no cart", 404));
  }
  const itemIndex = cart.cartItems.findIndex(
  (item) => item._id.toString() === req.params.itemId
  );
  if(itemIndex > -1){
   const cartItem = cart.cartItems[itemIndex];
   cartItem.quantity = quantity;
   cart.cartItems[itemIndex] = cartItem;
  }else{
   return next(new ApiError("There is no item", 404));
  }
  calcTotalPrice(cart);
 await cart.save();
   res
    .status(200)
    .json({ numberOfCartItems: cart.cartItems.length, data: cart });
});

//apply coupon code
//@desc  apply coupon code
//@Route Put /api/v1/cart/applycoupon
//@access Private Just logged User
exports.applyCouponCode = asyncHandler(async(req, res, next)=>{
//Get The Coupon Based On The Name
const coupon = await Coupon.findOne({
   name:req.body.coupon,
   expire: {$gt:Date.now()}
 });
 if(!coupon){
    return next(new ApiError("Invalid Coupon Or Expired",404));
 }
 //Get Logged User Cart to get Total price;
 const cart = await Cart.findOne({user:req.user._id});
 const totalPrice = cart.totalCartPrice;
 const totalPriceAfterDiscount = ( totalPrice - (totalPrice * coupon.discount)/100).toFixed(2);
 cart.totalCartPriceAfterDiscount = totalPriceAfterDiscount;
 
 await cart.save();
 res
    .status(200)
    .json({ numberOfCartItems: cart.cartItems.length, data: cart });
})