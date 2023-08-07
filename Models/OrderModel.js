const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
        color: String,
      },
    ],
      taxPrice: {
      type: Number,
      default: 0,
    },
     shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalOrderPrice: Number,
     paymentMethodType: {
      type: String,
      enum: ["cash", "credit"],
      default: "cash",
    },
    status: {
      type: String,
      default: "under review",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true })
  
  orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImg email phone",
  }).populate({ path: "cartItems.product", select: "title imageCover price quantity" });
  next();
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;