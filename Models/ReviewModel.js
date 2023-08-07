const mongoose = require("mongoose");
const Product = require("./ProductModel")
const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min ratings value is 1.0"],
      max: [5, "Max ratings value is 5.0"],
      require: [true, "Rating Value Is required"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review Must belong to User"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review Must belong to Product"],
    },
  },
  { timestamps: true },
);

ReviewSchema.statics.calcAvrageRatingsAndQuantities = async function (
  productId
) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calcAvrageRatingsAndQuantities(this.product);
});
ReviewSchema.post("remove", async function () {
  await this.constructor.calcAvrageRatingsAndQuantities(this.product);
});


ReviewSchema.pre(/^find/,function(next){
 this.populate({path:'user', select:"name profileImg"});
 next();
})

module.exports = mongoose.model("Review", ReviewSchema);
