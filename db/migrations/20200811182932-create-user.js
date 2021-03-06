const { S3_BUCKET_URL } = require('../../config/amazon');

'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING
      },
      totalOpdoots: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      views: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      profilePicture: {
        allowNull: false,
        defaultValue: S3_BUCKET_URL + '/' + "users/default-user-image.jpg",
        type: Sequelize.STRING
      },
      posts: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      about: {
        type: Sequelize.CHAR(1000),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};