const axios = require("axios");

const app = axios.create({
  baseURL: "https://graph.facebook.com/v21.0",
});

module.exports = app;
