const { Op } = require("sequelize");
const { BusinessCategory } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const findBusinessCategoryByUUID = async (uuid) => {
  try {
    const response = await BusinessCategory.findOne({
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
const addBusinessCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const response = await BusinessCategory.create({
      name,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getBusinessCategories = async (req, res) => {
  try {
    const response = await BusinessCategory.findAll();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getBusinessCategory = async (req, res) => {
  try {
    const { uuid } = req.params;
    const channel = await BusinessCategory.findOne({
      where: {
        uuid,
      },
    });
    successResponse(res, channel);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteBusinessCategory = async (req, res) => {
  try {
    const { uuid } = req.params;
    const channel = await BusinessCategory.findOne({
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
const editBusinessCategory = async (req, res) => {
  try {
    const { uuid } = req.params;
    const data = req.body;
    const channel = await BusinessCategory.findOne({
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
  addBusinessCategory,
  deleteBusinessCategory,
  editBusinessCategory,
  getBusinessCategory,
  getBusinessCategories,
  findBusinessCategoryByUUID,
};
