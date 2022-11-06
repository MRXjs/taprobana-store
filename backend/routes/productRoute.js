const express = require("express");
const {
  getAllProducts,
  craeteProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/productController.js");
const {
  isAuthonticatedUser,
  authorizeRoles,
} = require("../middleware/auth.js");

const router = express.Router();

router.route("/products").get(getAllProducts);

router
  .route("/products/new")
  .post(isAuthonticatedUser, authorizeRoles("admin"), craeteProduct);

router
  .route("/product/:id")
  .put(isAuthonticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthonticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router.route("/review").put(isAuthonticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthonticatedUser, deleteReview);

module.exports = router;
