"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable("MetaCampaigns", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      facebookCampaignId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
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
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      startDate: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      endDate: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable("MetaCampaigns");
  },
};
