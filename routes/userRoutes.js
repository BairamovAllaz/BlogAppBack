const express = require("express");
const {
  signUp,
  Login,
  loginWithGoogle,
  getUserData
} = require("../controllers/AuthController");
const verifyToken = require("../Middleware/auth");
const router = express.Router();

router.post("/SignIn", signUp); 
router.post("/login", Login); 
router.post("/googleauth",loginWithGoogle);
router.get("/userData", verifyToken, getUserData);

module.exports = router;
