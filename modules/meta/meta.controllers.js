const moment = require("moment");
const app = require("../../utils/axiosConfig");
const { errorResponse, successResponse } = require("../../utils/responses");

const getPagePosts = async (req, res) => {
  try {
    const { pageAccessToken, pageId } = req.query;
    let posts = [];
    try {
      const response = await app.get(`/${pageId}/published_posts`, {
        params: {
          fields: "id,full_picture,message",
          access_token: pageAccessToken,
        },
      });
      posts = response.data.data;
    } catch (error) {
      console.log("failed to get data");
    }
    successResponse(res, posts);
  } catch (error) {
    console.log(error.response);
    errorResponse(res, error.response);
  }
};
const getInstagramPosts = async (req, res) => {
  try {
    const { userAccessToken, instagramAccountId } = req.query;
    let posts = [];
    try {
      const response = await app.get(`/${instagramAccountId}/media`, {
        params: {
          fields: "thumbnail_url,media_url,media_type,caption,shortcode",
          access_token: userAccessToken,
        },
      });
      posts = response.data.data;
    } catch (error) {
      console.log("failed to get data");
    }
    successResponse(res, posts);
  } catch (error) {
    console.log(error.response);
    errorResponse(res, error.response);
  }
};

const createCampaign = async (campaignInfo) => {
  try {
    console.log(
      process.env.MARKETING_AD_ACCOUNT_ID,
      process.env.MARKETING_ACCESS_TOKEN
    );
    const response = await app.post(
      `/act_${process.env.MARKETING_AD_ACCOUNT_ID}/campaigns`,
      {
        name: campaignInfo.name,
        objective: "OUTCOME_AWARENESS",
        status: "PAUSED",
        special_ad_categories: [],
      },
      {
        params: { access_token: process.env.MARKETING_ACCESS_TOKEN },
      }
    );
    return response.data;
  } catch (error) {
    // console.error("Error creating campaign:", error.response);
  }
};

const createAdSet = async (campaignInfo, campaignId) => {
  try {
    console.log(campaignId);

    // Calculate start and end times
    const startTime = moment().add(1, "minute").toISOString(); // Start 1 minute from now
    const daysToAdd =
      campaignInfo.Package.price === 30000
        ? 1
        : campaignInfo.Package.price === 50000
        ? 7
        : 30;
    const endTime = moment().add(daysToAdd, "days").toISOString(); // Add respective days
    console.log("Price", parseInt(campaignInfo.Package.price / 2700 / 2));
    console.log(startTime, endTime);
    const response = await app.post(
      `/act_${process.env.MARKETING_AD_ACCOUNT_ID}/adsets`,
      {
        name: `${campaignInfo.name} Ad Set`,
        campaign_id: campaignId,
        start_time: startTime, // Proper ISO 8601 format
        end_time: endTime, // Proper ISO 8601 format
        lifetime_budget: parseInt(campaignInfo.Package.price / 2700 / 2) * 100,
        billing_event: "IMPRESSIONS",
        optimization_goal: "IMPRESSIONS",
        bid_strategy: "LOWEST_COST_WITHOUT_CAP",
        targeting: {
          geo_locations: {
            countries: [campaignInfo.target],
          },
          age_min: campaignInfo.targetMinAge,
          age_max: campaignInfo.targetMaxAge,
          genders:
            campaignInfo.targetGender === 0
              ? [1, 2] // Target both male and female
              : campaignInfo.targetGender === 1
              ? [1] // Target male
              : [2],
          interests: Object.values(campaignInfo.targetInterests).map((item) => {
            return { id: item.id, name: item.name };
          }),
        },
        status: "PAUSED",
      },
      {
        params: { access_token: process.env.MARKETING_ACCESS_TOKEN },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating ad set:", error.response.data);
  }
};

const createAdCreative = async (campaignInfo) => {
  try {
    const response = await app.post(
      `/act_${process.env.MARKETING_AD_ACCOUNT_ID}/adcreatives`,
      {
        name: `${campaignInfo.name} Creative`,
        object_story_spec: {
          page_id: campaignInfo.page.id,
          link_data: {
            message: campaignInfo.ads.message || campaignInfo.ads.caption,
            caption: "",
            link: campaignInfo.link,
            picture:
              campaignInfo.ads.full_picture || campaignInfo.ads.media_url,
          },
        },
        degrees_of_freedom_spec: {
          creative_features_spec: {
            standard_enhancements: {
              enroll_status: "OPT_OUT",
            },
          },
        },
      },
      {
        params: { access_token: process.env.MARKETING_ACCESS_TOKEN },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating ad creative:", error.response.data);
  }
};

const createAd = async (campaignInfo, adSetId, creativeId) => {
  try {
    const response = await app.post(
      `/act_${process.env.MARKETING_AD_ACCOUNT_ID}/ads`,
      {
        name: `${campaignInfo.name} Ad`,
        adset_id: adSetId,
        creative: {
          creative_id: creativeId,
        },
        status: "PAUSED", // Set to "PAUSED" when ready
      },
      {
        params: { access_token: process.env.MARKETING_ACCESS_TOKEN },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating ad:", error.response.data);
  }
};

const uploadImage = async (imageUrl) => {
  try {
    const response = await app.post(
      `/act_${process.env.MARKETING_AD_ACCOUNT_ID}/adimages`,
      {
        url: imageUrl, // The URL of the image
      },
      {
        params: { access_token: process.env.MARKETING_ACCESS_TOKEN },
      }
    );
    return response.data.images.bytes.hash; // Use this hash in the ad creative
  } catch (error) {
    console.error("Error uploading image:", error.response.data);
  }
};

const fetchInterest = async (req, res) => {
  try {
    const { keyword } = req.query;
    let response = await app.get(`/search`, {
      params: {
        type: "adinterest",
        q: keyword,
        access_token: process.env.MARKETING_ACCESS_TOKEN,
      },
    });
    response = response.data.data;
    successResponse(res, response);
  } catch (error) {
    console.error(error.response.data);
    errorResponse(res, error);
  }
};

module.exports = {
  getPagePosts,
  createCampaign,
  createAdSet,
  getInstagramPosts,
  createAdCreative,
  createAd,
  fetchInterest,
  uploadImage,
};
