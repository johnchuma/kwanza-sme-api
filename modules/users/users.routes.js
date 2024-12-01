const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  addUser,
  getUsers,
  getMyInfo,
  getUserInfo,
  updateUser,
  deleteUser,
  confirmCode,
  getFbLoginLink,
  storeAccessToken,
  sendCode,
} = require("./users.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", addUser);
router.post("/auth/confirm-code", confirmCode);
router.post("/auth/send-code", sendCode);
router.get("/", getPagination, getUsers);
router.get("/me", validateJWT, getMyInfo);
router.get("/fb-login-link", getFbLoginLink);
router.post("/store-token", validateJWT, storeAccessToken);
router.get("/me", validateJWT, getMyInfo);
router.get("/:uuid", validateJWT, getUserInfo);
router.patch("/:uuid", validateJWT, updateUser);
router.delete("/:uuid", validateJWT, deleteUser);

module.exports = router;
