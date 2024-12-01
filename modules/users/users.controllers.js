const { Op } = require("sequelize");
const { User, BusinessCategory } = require("../../models");
const { generateJwtTokens } = require("../../utils/generateJwtTokens");
const { errorResponse, successResponse } = require("../../utils/responses");
const { randomNumber } = require("../../utils/random_number");
const { FacebookAdsApi } = require("facebook-nodejs-business-sdk");
const axios = require("axios");
require("dotenv").config();
const {
  findBusinessCategoryByUUID,
} = require("../businessCategories/businessCategories.controllers");
const facebook = require("../../utils/facebook");
const app = require("../../utils/axiosConfig");
const findUserByUUID = async (uuid) => {
  try {
    const user = await User.findOne({
      where: {
        uuid,
      },
      include: [
        {
          model: BusinessCategory,
        },
      ],
    });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const checkIfUserExists = async (phone) => {
  const user = await User.findOne({
    where: {
      phone,
    },
  });
  return user;
};
const addUser = async (req, res) => {
  try {
    let { name, email, phone, landingPage, business_category_uuid } = req.body;

    let user = await checkIfUserExists(phone);
    if (user) {
      res.status(401).json({
        status: false,
        message: "Account already exist",
      });
    } else {
      const code = randomNumber();
      const businessCategory = await findBusinessCategoryByUUID(
        business_category_uuid
      );
      const user = await User.create({
        name,
        phone,
        verificationCode: 123456,
        email,
        landingPage,
        businessCategoryId: businessCategory.id,
      });

      successResponse(res, {
        message: "Verification code is sent successfully",
      });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const confirmCode = async (req, res) => {
  try {
    let { phone, code } = req.body;
    const user = await User.findOne({
      where: {
        phone,
      },
    });
    console.log(user);
    if (user) {
      const result = user.verificationCode == code;
      if (result) {
        const tokens = generateJwtTokens(user);
        res.status(200).json({
          body: {
            tokens,
          },
          status: true,
        });
        await user.update({
          verificationCode: null,
        });
      } else {
        res.status(401).send({
          status: false,
          message: "Wrong code or Already used",
        });
      }
    } else {
      res
        .status(404)
        .send({ status: false, message: "Account does not exist" });
    }
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    const { keyword } = req.query;
    const response = await User.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${keyword}%`,
        },
      },
      include: [BusinessCategory],
      attributes: {
        exclude: ["id"],
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

const getUserInfo = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    successResponse(res, user);
  } catch (error) {
    errorResponse(res, error);
  }
};
const sendCode = async (req, res) => {
  try {
    let { phone } = req.body;
    let user = await User.findOne({
      where: {
        phone,
      },
    });
    if (user) {
      const code = 123456;
      user = await user.update({
        verificationCode: code,
      });

      // await sendSMS(
      //   addPrefixToPhoneNumber(user.phone),
      //   `Your verification code is ${user.password} `
      // );

      successResponse(res, {
        message: "Verification code is sent successfully",
      });
    } else {
      res
        .status(404)
        .send({ status: false, message: "Account does not exist" });
    }
  } catch (error) {
    errorResponse(res, error);
  }
};

const getFbLoginLink = async (req, res) => {
  try {
    // Define the permissions you're requesting
    const permissions = [
      "email",
      "ads_management",
      "ads_read",
      "business_management",
      "pages_read_engagement",
      "pages_show_list",
      "public_profile",
      "instagram_basic",
      "instagram_manage_insights",
      "instagram_manage_comments",
    ];

    const redirectUri = "https://sme.kwanza.io/create-campaign?tab=setup"; // Make sure this is URL-encoded

    const loginUrl = `https://www.facebook.com/v21.0/dialog/oauth?response_type=token&client_id=${
      process.env.FB_APP_ID
    }&redirect_uri=${redirectUri}&scope=${permissions.join(",")}`;

    // Respond with the login URL
    successResponse(res, { loginUrl });
  } catch (error) {
    errorResponse(res, error.message || "Failed to get Facebook link");
  }
};
const storeAccessToken = async (req, res) => {
  try {
    const { token } = req.body; // Get the 'code' from the client (OAuth code)
    console.log(token);
    console.log(req.user);
    const user = await User.findOne({
      where: {
        id: req.user.id, // Assuming `req.user.id` contains the logged-in user's ID
      },
    });
    // Update the user's record with the obtained Facebook access token
    await user.update({
      facebookAccessToken: token, // Save the token to the user's record
    });

    // Respond with success
    successResponse(res, { message: "Token stored successfully" });
  } catch (error) {
    // Log and handle any errors that occur
    console.error(error.response ? error.response.data : error.message);
    errorResponse(res, error.message || "Failed to store token");
  }
};

const getMyInfo = async (req, res) => {
  try {
    const user = req.user;
    const userProfile = await findUserByUUID(user.uuid);

    // Initialize variables for Facebook profile and pages
    let fbProfile = {};
    let pages = [];
    let instagramAccounts;

    // If the user has a Facebook access token, fetch the profile and pages
    if (userProfile.facebookAccessToken) {
      try {
        // Fetch Facebook profile
        const fbProfileResponse = await app(`/me`, {
          params: {
            access_token: userProfile.facebookAccessToken,
            fields: "id,name,picture,link,location,email",
          },
        });
        fbProfile = fbProfileResponse.data;

        // Fetch Facebook pages
        const fbPagesResponse = await app(`/me/accounts`, {
          params: {
            access_token: userProfile.facebookAccessToken,
          },
        });
        const userBusinesses = await app(`/me/businesses`, {
          params: {
            access_token: userProfile.facebookAccessToken,
          },
        });
        instagramAccounts = await app.get(
          `/${userBusinesses.data.data[0].id}/instagram_business_accounts`,
          {
            params: {
              access_token: userProfile.facebookAccessToken,
            },
          }
        );
        instagramAccounts = instagramAccounts.data.data;
        pages = fbPagesResponse.data.data;
      } catch (fbError) {
        console.error(
          "Facebook API error:",
          fbError.response?.data || fbError.message
        );
      }
    }

    // Return the collected data
    return successResponse(res, {
      success: true,
      userProfile,
      fbProfile,
      instagramAccounts,
      pages,
    });
  } catch (error) {
    console.error("Error in getMyInfo:", error);
    return errorResponse(res, error.response || error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const response = await user.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const user = await findUserByUUID(uuid);
    const response = await user.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  addUser,
  findUserByUUID,
  getUsers,
  confirmCode,
  deleteUser,
  getUserInfo,
  getFbLoginLink,
  storeAccessToken,
  checkIfUserExists,
  getMyInfo,
  sendCode,
  updateUser,
};
