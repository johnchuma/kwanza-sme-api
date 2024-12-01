const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addPackage,
  getPackages,
  getPackage,
  editPackage,
  deletePackage,
} = require("./packages.controllers");

const router = Router();

router.post("/", validateJWT, addPackage);
router.get("/", validateJWT, getPackages);
router.get("/:uuid", validateJWT, getPackage);
router.patch("/:uuid", validateJWT, editPackage);
router.delete("/:uuid", validateJWT, deletePackage);

module.exports = router;
