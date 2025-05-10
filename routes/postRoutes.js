const express = require("express");
const { CreatePost } = require("../controllers/PostController");
const router = express.Router();

router.post("/createPost", CreatePost);

module.exports = router;
