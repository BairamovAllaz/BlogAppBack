const express = require("express");
const { CreatePost, getPostByPreviewToken, updatePostByPreviewToken } = require("../controllers/PostController");
const router = express.Router();

router.post("/createPost", CreatePost);
router.put("/preview/:previewToken", updatePostByPreviewToken);
router.get("/preview/:previewToken", getPostByPreviewToken)

module.exports = router;
