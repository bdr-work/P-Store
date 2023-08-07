const Category = require("../Models/CategoryModel");
const factory = require("./handlerFactory");

//@Desc - Create a new Category
//method POST - /api/v1/pstore/categories
//PRIVATE - Admin
exports.createCategory = factory.createOne(Category);
//@Desc - Get All Categories
//method Get - /api/v1/pstore/categories
//PUBLIC - any one
exports.getAllCategories = factory.getAll(Category);
//@Desc - Get Specific Category
//method Get - /api/v1/pstore/categories/:categoryId
//PUBLIC - any one
exports.getOne = factory.getOne(Category);
//@Desc - Get Update Category
//method Put - /api/v1/pstore/categories/:categoryId
//Private - any one
exports.updateOne = factory.updateOne(Category);
//@Desc - Delete Specific Category
//method Delete - /api/v1/pstore/categories/:categoryId
//Private - Admin
exports.deleteOne = factory.deleteOne(Category);
