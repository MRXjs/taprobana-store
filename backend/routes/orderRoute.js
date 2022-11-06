const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();
const { isAuthonticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/order/new").post(isAuthonticatedUser, newOrder);

router.route("/order/:id").get(isAuthonticatedUser, getSingleOrder);

router.route("/orders/me").get(isAuthonticatedUser, myOrders);

router
  .route("/admin/orders")
  .get(isAuthonticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthonticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthonticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
