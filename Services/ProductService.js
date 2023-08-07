const Product = require("../Models/ProductModel");
const factory = require("./handlerFactory");
const asyncHandler = require("express-async-handler");
const { uploadImages } = require("../Middleware/uploadImageMiddleware");
//Upload Single image And images

const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

exports.uploadImages = uploadImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
//Image Proccessing for product images
exports.resizeImageBySharp = asyncHandler(async (req, res, next) => {
  //Image Proccessing for Image Cover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-ImageCover-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    //Save Image In Our DB;
    req.body.imageCover = imageCoverFileName;
  }
  //This Code For Images Upload
  if (req.files.images) {
    req.body.images = [];
    //Promise all for add All thing in map and Done
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const imagesFileName = `product-${uuidv4()}-${Date.now()}-${
          index + 1
        }.jpeg`;
        await sharp(image.buffer)
          .resize(500, 500)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imagesFileName}`);
        //Save ImageCover In db
        req.body.images.push(imagesFileName);
      }),
    );
  }
  next();
});

exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObj = filterObject;
  next();
};
//@Desc - Create a new Product
//method POST - /api/v1/pstore/products
//PRIVATE - Admin
exports.createProduct = factory.createOne(Product);
//@Desc - Get All Categories
//method Get - /api/v1/pstore/categories
//PUBLIC - any one
exports.getAllProducts = factory.getAll(Product, "Product");
//@Desc - Get Specific Category
//method Get - /api/v1/pstore/categories/:categoryId
//PUBLIC - any one
exports.getOne = factory.getOne(Product,"reviews");
//@Desc - Get Update Category
//method Put - /api/v1/pstore/categories/:categoryId
//Private - any one
exports.updateOne = factory.updateOne(Product);
//@Desc - Delete Specific Category
//method Delete - /api/v1/pstore/categories/:categoryId
//Private - Admin
exports.deleteOne = factory.deleteOne(Product);
