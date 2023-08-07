const express = require("express");
const {
  // getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateUserLoggedValidator,
} = require("../Utils/validators/UserValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
  reActiveLoggedUserData,
} = require("../Services/UserService");

const Authorization = require("../Services/authService");

const router = express.Router();

router.use(Authorization.protect);

router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateUserLoggedValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);
router.put("/activeMe", reActiveLoggedUserData, getUser);

//Admin
router.use(Authorization.allowedTo("admin"));

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword,
);
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
