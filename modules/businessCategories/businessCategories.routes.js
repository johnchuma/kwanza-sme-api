const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addBusinessCategory,
  getBusinessCategories,
  getBusinessCategory,
  editBusinessCategory,
  deleteBusinessCategory,
} = require("./businessCategories.controllers");

const router = Router();

router.post("/", addBusinessCategory);
router.get("/", getBusinessCategories);
router.get("/:uuid", validateJWT, getBusinessCategory);
router.patch("/:uuid", validateJWT, editBusinessCategory);
router.delete("/:uuid", validateJWT, deleteBusinessCategory);

module.exports = router;
