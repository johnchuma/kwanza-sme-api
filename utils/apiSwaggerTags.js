const usersTag = (req, res, next) => {
  // #swagger.tags = ['Users']
  next();
};
const metaTag = (req, res, next) => {
  // #swagger.tags = ['Meta']
  next();
};
const metaCampaignsTag = (req, res, next) => {
  // #swagger.tags = ['Meta Campaigns']
  next();
};
const packagesTag = (req, res, next) => {
  // #swagger.tags = ['Packages']
  next();
};
const businessCategoriesTag = (req, res, next) => {
  // #swagger.tags = ['Business Categories']
  next();
};
module.exports = {
  usersTag,
  metaCampaignsTag,
  packagesTag,
  metaTag,
  businessCategoriesTag,
};
