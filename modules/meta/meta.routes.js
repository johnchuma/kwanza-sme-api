const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getPagePosts,
  fetchInterest,
  getInstagramPosts,
} = require("./meta.controllers");
const router = Router();
router.get("/page-posts", validateJWT, getPagePosts);
router.get("/instagram-posts", validateJWT, getInstagramPosts);
router.get("/ad-interests", validateJWT, fetchInterest);
module.exports = router;
