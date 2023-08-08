const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/apiError");
const Order = require("../Models/OrderModel");
const Cart = require("../Models/CartModel");
const Product = require("../Models/ProductModel");
const factory = require("./handlerFactory");

//@desc Create Cash Order
//@Route  Post /api/v1/orders/cartId
//@access Private Just logged User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  //app Sittings
  const shippingPrice = 0;
  const taxPrice = 0;
  //1 - get the cart dependent on cart id

  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  //2- get the total price dependent on cart price ====> check coupon apply
  const cartPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  //3- create the order with default payment method "Cash"
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  //4 - After created order : decrement product quantity , increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});
    //5- clear Cart depend on cart Id
    await Cart.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ status: "success", data: order });
});
//@desc Get All Orders
//@Route  Get /api/v1/orders
//@access Private Admin-manager-User
exports.filterOrdersForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
exports.findAllOrders = factory.getAll(Order);
//@desc Get One Orders
//@Route  Get /api/v1/orders
//@access Private Admin-manager-User
exports.findOrder = factory.getOne(Order);

//@desc Update status of Order
//@Route  Put /api/v1/orders/:orderId/status/underway
//@access Private Admin-manager
exports.updateOrderStatusToUnderway = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("There is no Order with this Id", 404));
  }
  order.status = "Underway";
  await order.save();
  res.json({ status: "Success", data: order });
});
//@desc Update status of Order
//@Route  Put /api/v1/orders/:orderId/status/done
//@access Private Admin-manager
exports.updateOrderStatusToDone = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("There is no Order with this Id", 404));
  }
  order.status = "Done";
  await order.save();
  res.json({ status: "Success", data: order });
});
//@desc Update status of pay
//@Route  Put /api/v1/orders/:orderId/pay
//@access Private Admin-manager
exports.updateOrderStatusPay = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("There is no Order with this Id", 404));
  }
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();
  res.json({ status: "Success", data: order });
});
//@desc Update status of Delivery Order
//@Route  Put /api/v1/orders/:orderId/delivery
//@access Private Admin-manager
exports.updateOrderStatusDeliver = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ApiError("There is no Order with this Id", 404));
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();
  await order.save();
  res.json({ status: "Success", data: order });
});

//@desc Create Online Order
//@Route  Post /api/v1/orders/cartId
//@access Private Just logged User

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const shippingPrice = 0;
  const taxPrice = 0;

  //get Cart Dependent on cartid
  // const cart = await Cart.findById(req.params.cartId);
  // if(!cart){
  //  return next(new ApiError("Cart not found",404));
  // }
  //2- get the total price dependent on cart price ====> check coupon apply
  //  const cartPrice = cart.totalCartPriceAfterDiscount ? cart.totalCartPriceAfterDiscount : cart.totalCartPrice;
  //  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  //Crete a session for checkout
  res.render("index", { title: "Test" });

  // res.status(200).json({ status: "success", res: response.data});
});
