const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productType: {
      type: String,
      enum: ["digital", "noDegital"],
      default: "digital",
    },
    title: {
      type: String,
      required: [true, "Product Name is required"],
      tirm: true,
      minlength: [3, "Product Name is to short"],
      maxlength: [100, "Product Name is to long"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product Description is required"],
      tirm: true,
      minlegnth: [20, "Product description must be more than 20 characters"],
    },
    quantity: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Please add a Product price"],
      tirm: true,
      max: [1000000, "Product price must be less than 10 Number"],
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Please add a Product image cover"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please add the Product to Main Category."],
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be 5.0 or less than 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    // to enable visual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
//Set Image Url
const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageURL = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageURL;
  }
  const urlImages = [];
  if (doc.images) {
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      urlImages.push(imageUrl);
    });
    doc.images = urlImages;
  }
};
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
//Save image of product with the Name
productSchema.post("init", (doc) => {
  setImageURL(doc);
});
//Save image of product with the Name
productSchema.post("save", (doc) => {
  setImageURL(doc);
});
// Mongoose middleware query to populate Category name in product
productSchema.pre(/^find/, function (next) {
  this.populate({ path: "category", select: "name -_id" });
  next();
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
