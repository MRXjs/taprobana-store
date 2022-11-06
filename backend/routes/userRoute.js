const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassowrd,
  resetPassowrd,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController.js");
const { isAuthonticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassowrd);

router.route("/password/reset/:token").put(resetPassowrd);

router.route("/logout").get(logout);

router.route("/me").get(isAuthonticatedUser, getUserDetails);

router.route("/password/update").put(isAuthonticatedUser, updatePassword);

router.route("/me/update").put(isAuthonticatedUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthonticatedUser, authorizeRoles("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthonticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthonticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthonticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
