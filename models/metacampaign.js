"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MetaCampaign extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MetaCampaign.belongsTo(models.Package);
      MetaCampaign.belongsTo(models.User);
    }
  }
  MetaCampaign.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      facebookCampaignId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      packageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      facebookPage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      target: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      page: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      targetLat: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      targetLong: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      targetRadius: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      targetGender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      targetMinAge: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      targetMaxAge: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      targetInterests: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      targetChannels: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      ads: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      startDate: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      endDate: {
        allowNull: true,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "MetaCampaign",
    }
  );
  return MetaCampaign;
};
