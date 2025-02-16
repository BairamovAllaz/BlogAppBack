const express = require("express");
const {
  signUp,
  Login,
  loginWithGoogle,
} = require("../controllers/AuthController");

const router = express.Router();

router.post("/SignIn", signUp); 
router.post("/login", Login); 
router.post("/googleauth",loginWithGoogle);

module.exports = router;
