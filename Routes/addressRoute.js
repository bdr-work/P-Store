const express = require("express");

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../Services/addressService");
const Authorization = require("../Services/authService");

const router = express.Router();
router.use(Authorization.protect, Authorization.allowedTo("user"));
// .
// .
// .
//----------------------------------------------------------------------
//Routes
router.route("/").post(addAddress).get(getLoggedUserAddresses);

router.delete("/:addressId", removeAddress);

module.exports = router;
