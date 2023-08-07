const crypto = require("crypto");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const ApiError = require("../Utils/apiError");
// const sendEmail = require("../util/sendEmail");
const createToken = require("../Utils/createToken");
const sendMessage = require("../Utils/sendMessage");
const User = require("../Models/UserModel");
// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  // 1- Create user
  let otpCodeExpires
  let otpCodeVerified
  let user ={};
let otpCode = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedOtpCode = crypto
    .createHash("sha256")
    .update(otpCode)
    .digest("hex");
  // Add expiration time for password reset code (10 min)
  otpCodeExpires = Date.now() + 10 * 60 * 1000;
  otpCodeVerified = false;
   user = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    otpCode: hashedOtpCode,
    otpCodeExpires: otpCodeExpires,
    otpCodeVerified:otpCodeVerified
  };
const message = `Hi <strong>${user.name}</strong>,<br> OTP code: <strong style="color:red">${otpCode}</strong><br>Enter this OTP code to complete registration (valid for 10 min).<br> Be safe dear.\n The P Store Team`;
 try {
    await sendMessage.sendEmail({
      email: req.body.email,
      subject: "Your OTP code to complete registration.",
      message,
      html: `${message}`,
    });
  await User.create({
   name: user.name,
   email: user.email,
   password: user.password,
   phone: user.phone,
  otpCode: user.otpCode,
  otpCodeExpires:user.otpCodeExpires,
  otpCodeVerified: user.otpCodeVerified
});
  } catch (err) {
    user.otpCode = undefined;
    user.otpCodeExpires = undefined;
    user.otpCodeVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

 res.status(200).json({
    status: "Success",
    message:
      "OTP code sent to email, IF you can't find the message please check junk.",
  });

  // // 2- Generate token
  // const token = createToken(user._id);

  // res.status(201).json({ data: user, token });
});
exports.verifyOtpCode = asyncHandler(async(req,res,next)=>{
 //Get User otp code 
 const hashedOtpCode = crypto
    .createHash("sha256")
    .update(req.body.otpCode)
    .digest("hex");
    
    const user = await User.findOne({
       otpCode: hashedOtpCode,
       otpCodeExpires: { $gt: Date.now() },
    });
    if (!user) {
    return next(new ApiError("OTP code invalid or expired",400));
  }
  // 2) otp code valid
  user.otpCodeVerified = true;
if(!user.otpCodeVerified){
  return next(new ApiError("OTP code not verified", 400));
}
  // 3) if everything is ok, generate token 
   user.otpCodeVerified = undefined;
   user.otpCodeExpires = undefined;
   user.otpCode = undefined;
  await user.save();
  const token = createToken(user._id);  
  res.status(200).json({data:user,token });
})
// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  // 1) check if password and phone in the body (validation)
  // 2) check if user exist & check if password is correct
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect phone or password", 401));
  }
  // 3) generate token
  const token = createToken(user._id);

  // Delete password from response
  delete user._doc.password;
  // 4) send response to client side
  res.status(200).json({ data: user, token });
});
// @desc   make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, please login to get access this route.",
        401,
      ),
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // 3) Check if user exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user that belong to this token does no longer exist.",
        401,
      ),
    );
  }
  // 4) Check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    //Cnvert Date Tow TimeStamp
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10,
    );
    // Password changed after token created (Error)
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password. please login again.",
          401,
        ),
      );
    }
  }

  req.user = currentUser;
  next();
});
// @desc    Authorization (User Permissions)
// ["admin", "manager"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403),
      );
    }
    next();
  });
// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404),
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.resetCodeExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetCodeVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi <strong>${user.name}</strong>,<br> We received a request to reset the password on your P Store Account.<hr><strong style="color:red">${resetCode}</strong><br>Enter this code to complete the reset.<hr>Be safe dear.<br>Thanks for helping us keep your account secure.<hr>The P Store Team`;
  try {
    await sendMessage.sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
      html: `${message}`,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.resetCodeExpires = undefined;
    user.passwordResetCodeVerified = undefined;
    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res.status(200).json({
    status: "Success",
    message:
      "Reset code sent to email, IF you can't find the message please check junk.",
  });
});
// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    resetCodeExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Reset code invalid or expired"));
  }

  // 2) Reset code valid
  user.passwordResetCodeVerified = true;
  await user.save();

  res.status(200).json({
    status: "Success",
  });
});
// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user based on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with email ${req.body.email}`, 404),
    );
  }

  // 2) Check if reset code verified
  if (!user.passwordResetCodeVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordChangeAt = Date.now();
  user.passwordResetCode = undefined;
  user.resetCodeExpires = undefined;
  user.passwordResetCodeVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
// exports.loginByPhone = asyncHandler(async (req, res, next) => {
//   // 1) Get user by email
//   const user = await User.findOne({ phone: req.body.phone });
//   if (!user) {
//     return next(new ApiError("No User with this phone number", 404));
//   }
//   // 2) If user exist, Generate hash reset random 6 digits and save it in db
//   const otp = Math.floor(1000 + Math.random() * 9000).toString();
//   const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
//   // Save hashed password reset code into db
//   user.otpCode = hashedOtp;
//   // Add expiration time for password reset code (10 min)
//   user.otpCodeExpires = Date.now() + 10 * 60 * 1000;
//   user.otpCodeVerified = false;
//   await user.save();
//   try {
//     // 3) Send the otp code via sms
//     const message = `Hi ${user.name},\n . \n OTP code: ${otp} \n to login to P Store. \n Be safe dear.\n The P Store Team`;
//     // const customerPhone = "+966" + user.phone.toString().substring(1);
//     // await sendMessage.sendSMS(message, customerPhone);
//    await client.messages
//   .create({
//      body: message,
//      from: '+12512973048',
//      to: '+12512973048'
//    })
//   .then(message => console.log(message.status));
//   } catch (err) {
//     user.otpCode = undefined;
//     user.otpCodeExpires = undefined;
//     user.otpCodeVerified = undefined;

//     await user.save();
//     return next(new ApiError("There is an error in sending SMS", 500));
//   }
//   res
//     .status(200)
//     .json({ status: "Success", message: "OTP code sent to Phone number" });
// });
