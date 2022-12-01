const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentController");
const router = express.Router();
const { isAuthonticatedUser } = require("../middleware/auth");

router.route("/payment/process").post(isAuthonticatedUser, processPayment);

router.route("/stripeapikey").get(isAuthonticatedUser, sendStripeApiKey);

module.exports = router;
