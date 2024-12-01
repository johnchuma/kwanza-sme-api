const axios = require("axios");
const circularJSON = require("circular-json");
require("dotenv").config();

const sendSMS = async (number, message) => {
  try {
    const data = JSON.stringify({
      from: "RMNDR",
      to: number,
      text: "Your message",
    });

    console.log(data);

    const response = await axios.post(
      "https://messaging-service.co.tz/api/sms/v1/text/single",
      data,
      {
        headers: {
          Authorization: process.env.SMS_AUTH,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    // Convert the response data to a string, handling circular references
    const jsonString = circularJSON.stringify(response.data);
    return jsonString;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = sendSMS;
