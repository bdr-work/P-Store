const express = require("express");

// express validator
const {
  signupUserValidator,
  loginUserValidator,
} = require("../Utils/validators/authValidator");
const {
  signup,
  login,
  forgotPassword,
  verifyOtpCode,
  resetPassword,
  verifyPassResetCode,
} = require("../Services/authService");

const router = express.Router();
// .
// .
// .
//----------------------------------------------------------------------
//Routes
router.post("/signup", signupUserValidator, signup);
router.post("/verifyOtpCode", verifyOtpCode);
router.post("/login", loginUserValidator, login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);

module.exports = router;
