const multer = require("multer");
const ApiError = require("../Utils/apiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();
  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images Allowed"), false);
    }
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (feildName) => multerOptions().single(feildName);
exports.uploadImages = (arrayFeilds) => multerOptions().fields(arrayFeilds);
