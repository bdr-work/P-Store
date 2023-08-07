const mongoose = require("mongoose");

//Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Category Name is Required"],
      unique: [true, "Category Name must be is Unique"],
      minlength: [3, "Category Name must be at least 3 characters"],
      maxlength: [32, "Category Name must be at less 32 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
