const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const { getPagination } = require("../../utils/getPagination");
const {
  addMetaCampaign,
  getMetaCampaigns,
  getMetaCampaign,
  editMetaCampaign,
  deleteMetaCampaign,
  getUserMetaCampaigns,
  getLatestMetaCampaign,
  activateCampaign,
} = require("./metaCampaigns.controllers");

const router = Router();

router.post("/", validateJWT, addMetaCampaign);
router.get("/", validateJWT, getPagination, getMetaCampaigns);
router.get("/me", validateJWT, getPagination, getUserMetaCampaigns);
router.get("/latest", validateJWT, getLatestMetaCampaign);
router.post("/activate/:uuid", activateCampaign);
router.get("/:uuid", validateJWT, getMetaCampaign);
router.patch("/:uuid", validateJWT, editMetaCampaign);
router.delete("/:uuid", validateJWT, deleteMetaCampaign);

module.exports = router;
