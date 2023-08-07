const ApiError = require("../Utils/apiError");

//ارسال الخطأ في حالة التطوير نحتاج للتفاصيل الدقيقه
const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    //stack فائدته يعطيني مكان الخطأ بالضبط
    stack: err.stack,
  });
//ارسال الخطأ في حالة الانتاج او رفع الموقع النهائي مانحتاج للتفاصيل الدقيقه
const sendErrorForProduction = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again.", 401);
const handleJwtExpired = () =>
  new ApiError("Expired token, please login again.", 401);
const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "JsonWebExpiredError") err = handleJwtExpired();
    sendErrorForProduction(err, res);
  }
};

module.exports = globalError;
