const { Op } = require("sequelize");
const { MetaCampaign, Package, User } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findUserByUUID } = require("../users/users.controllers");
const { findPackageByUUID } = require("../packages/packages.controllers");
const {
  createCampaign,
  createAdSet,
  createAdCreative,
  uploadImage,
  createAd,
} = require("../meta/meta.controllers");

const findMetaCampaignByUUID = async (uuid) => {
  try {
    const response = await MetaCampaign.findOne({
      where: {
        uuid,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addMetaCampaign = async (req, res) => {
  try {
    const {
      businessCategory,
      landingPage,
      facebookPage,
      userMetaAccessToken,
      target,
      targetLat,
      targetLong,
      targetGender,
      targetMinAge,
      targetMaxAge,
      targetInterests,
      targetChannels,
      ads,
      startDate,
      endDate,
      package_uuid,
      user_uuid,
    } = req.body;
    const user = await findUserByUUID(user_uuid);
    const package = await findPackageByUUID(package_uuid);
    const response = await MetaCampaign.create({
      userId: user.id,
      packageId: package.id,
      businessCategory,
      landingPage,
      facebookPage,
      userMetaAccessToken,
      target,
      targetLat,
      targetLong,
      targetGender,
      targetMinAge,
      targetMaxAge,
      targetInterests,
      targetChannels,
      ads,
      startDate,
      endDate,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getMetaCampaigns = async (req, res) => {
  try {
    const { keyword } = req.query;
    const response = await MetaCampaign.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["createdAt", "DESC"]],
      where: {
        [Op.and]: [
          {
            name: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      rows: response.rows,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
const getUserMetaCampaigns = async (req, res) => {
  try {
    const { keyword } = req.query;
    const user = req.user;
    const response = await MetaCampaign.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["createdAt", "DESC"]],
      include: [Package, User],

      where: {
        [Op.and]: [
          {
            name: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            userId: user.id,
          },
          {
            isPublished: true,
          },
        ],
      },
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      rows: response.rows,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};
const getMetaCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    const channel = await MetaCampaign.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, channel);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getLatestMetaCampaign = async (req, res) => {
  try {
    const user = req.user;
    let campaign = await MetaCampaign.findOne({
      where: {
        userId: user.id,
        isPublished: false,
      },
      include: [Package, User],
    });
    if (!campaign) {
      campaign = await MetaCampaign.create({
        userId: user.id,
      });
    }
    successResponse(res, campaign);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteMetaCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    const channel = await MetaCampaign.findOne({
      where: {
        uuid,
      },
    });
    const response = await channel.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const editMetaCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const channel = await MetaCampaign.findOne({
      where: {
        uuid,
      },
    });
    const response = await channel.update(data);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const activateCampaign = async (req, res) => {
  try {
    const { uuid } = req.params;
    const metaCampaign = await MetaCampaign.findOne({
      where: {
        uuid,
      },
      include: [Package],
    });
    //campaign details
    const campaign = await createCampaign(metaCampaign);
    const campaignAdSet = await createAdSet(metaCampaign, campaign.id);
    const campaignAdCreative = await createAdCreative(metaCampaign);
    const ad = await createAd(
      metaCampaign,
      campaignAdSet.id,
      campaignAdCreative.id
    );
    const response = await metaCampaign.update({
      isPublished: true,
    });
    console.log("Created successfully");
    successResponse(res, { message: "Campaign is activated successfully" });
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
module.exports = {
  addMetaCampaign,
  deleteMetaCampaign,
  editMetaCampaign,
  getLatestMetaCampaign,
  getUserMetaCampaigns,
  getMetaCampaign,
  getMetaCampaigns,
  findMetaCampaignByUUID,
  activateCampaign,
};
