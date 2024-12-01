const Facebook = require("facebook-js-sdk");

const facebook = new Facebook({
  appId: process.env.FB_APP_ID,
  appSecret: process.env.FB_APP_SECRET,
  redirectUrl: "https://sme.kwanza.io", // Add protocol
  graphVersion: "v20.0",
});

module.exports = facebook;
