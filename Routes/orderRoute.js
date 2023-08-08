const express = require('express');

const {
  createCashOrder,
  filterOrdersForLoggedUser,
  findAllOrders,
  findOrder,
  updateOrderStatusDeliver,
  updateOrderStatusPay,
  updateOrderStatusToDone,
  updateOrderStatusToUnderway,
  checkoutSession
} = require("../Services/OrderService");
const Authorization = require("../Services/authService");

const router = express.Router();
// router.use(Authorization.protect);
// .
// .
// .
//----------------------------------------------------------------------
//Routes
router.get(
  "/checkout",
  // Authorization.allowedTo("user"),
  checkoutSession
);

router.route("/:cartId").post(Authorization.allowedTo("user"), createCashOrder);

router.get(
  "/",
  Authorization.allowedTo("user", "admin", "manager"),
  filterOrdersForLoggedUser,
  findAllOrders
);
router.get("/:id", findOrder);

router.get(
  "/:id/underway",
  Authorization.allowedTo("admin", "manager"),
  updateOrderStatusToUnderway
);
router.get(
  "/:id/done",
  Authorization.allowedTo("admin", "manager"),
  updateOrderStatusToDone
);
router.get(
  "/:id/pay",
  Authorization.allowedTo("admin", "manager"),
  updateOrderStatusPay
);
router.get(
  "/:id/deliver",
  Authorization.allowedTo("admin", "manager"),
  updateOrderStatusDeliver
);
module.exports = router;
