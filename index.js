const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const swaggerUi = require("swagger-ui-express");
const {
  metaCampaignsTag,
  usersTag,
  packagesTag,
  businessCategoriesTag,
  metaTag,
} = require("./utils/apiSwaggerTags");
const swaggerDocument = require("./swagger-output.json");
const UsersRoutes = require("./modules/users/users.routes");
const MetaRoutes = require("./modules/meta/meta.routes");
const MetaCampaignsRoutes = require("./modules/metaCampaigns/metaCampaigns.routes");
const PackagesRoutes = require("./modules/packages/packages.routes");
const BusinessCategoriesRoutes = require("./modules/businessCategories/businessCategories.routes");
app.use("/files", express.static("files"));
app.use("/extracted", express.static("extracted"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.text({ type: "text/plain" }));
app.use("/users", usersTag, UsersRoutes);
app.use("/meta", metaTag, MetaRoutes);
app.use("/meta-campaigns", metaCampaignsTag, MetaCampaignsRoutes);
app.use("/packages", packagesTag, PackagesRoutes);
app.use(
  "/business-categories",
  businessCategoriesTag,
  BusinessCategoriesRoutes
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(4000, () => {
  console.log("Server started at port 4000");
});
