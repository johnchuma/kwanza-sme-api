const { Op } = require("sequelize");
const { Package } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const findPackageByUUID = async (uuid) => {
  try {
    const response = await Package.findOne({
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
const addPackage = async (req, res) => {
  try {
    const { name, price, impressions, clicks, sms } = req.body;
    const response = await Package.create({
      name,
      price,
      impressions,
      clicks,
      sms,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getPackages = async (req, res) => {
  try {
    const response = await Package.findAll({
      order: [["price", "ASC"]],
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getPackage = async (req, res) => {
  try {
    const { uuid } = req.params;
    const channel = await Package.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, channel);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deletePackage = async (req, res) => {
  try {
    const { uuid } = req.params;
    const channel = await Package.findOne({
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
const editPackage = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const channel = await Package.findOne({
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
module.exports = {
  addPackage,
  deletePackage,
  editPackage,
  getPackage,
  getPackages,
  findPackageByUUID,
};
