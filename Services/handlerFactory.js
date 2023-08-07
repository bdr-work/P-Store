const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/apiError");
const ApiFeatures = require("../Utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findOneAndDelete({ _id: id });
    if (!document) {
      return next(new ApiError(`No document for this id( ${id}`, 404));
    }
    //Triger remove event when delete document
    //   document.remove();
    res
      .status(204)
      .json({ msg: `document( ${id} ) has been deleted Successfly` });
  });
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id( ${req.params.id} )`, 404),
      );
    }
    //Triger save event when updating document
    document.save();
    res.status(200).json({ data: document });
  });
exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne = (Model,populateOpt) =>
  asyncHandler(async (req, res, next) => {
  const { id } = req.params;
    //1) build the query
    let query = Model.findById(id);
    if (populateOpt) {
      query = query.populate(populateOpt);
    }
    //2) Execute the query
    const document = await query;
    if (!document) {
      return next(new ApiError(`No document for this id( ${id} )`, 404));
    }
    res.status(200).json({ data: document });
  });
  
exports.getAll = (Model, modelName) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    //2) Pagination
    //Build Query
    const documentsCount = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .pajinate(documentsCount)
      .filter()
      .sort()
      .fieldsLimit()
      .searching(modelName);
    // .populate({ path: "category", select: "name -_id" });
    //Execute Query
    const { mongooseQuery, pajinationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ results: documents.length, pajinationResult, data: documents });
  });
