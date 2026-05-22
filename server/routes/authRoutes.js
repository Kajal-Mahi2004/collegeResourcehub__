const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  adminSignup,
  adminLogin
} = require("../controllers/authController");

router.post("/signup", signup);

router.post("/login", login);

router.post("/admin/signup", adminSignup);

router.post("/admin/login", adminLogin);

module.exports = router;