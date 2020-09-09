'use strict';
const { S3_BUCKET_URL } = require('../../config/amazon');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PostId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Posts',
          key: 'id'
        }
      },
      CommentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Comments',
          key: 'id'
        }
      },
      opdoots: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      comment: {
        allowNull: false,
        defaultValue: '',
        type: Sequelize.CHAR(1000)
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      profilePicture: {
        allowNull: false,
        defaultValue: S3_BUCKET_URL + '/' + "users/default-user-image.jpg",
        type: Sequelize.STRING
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
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
    await queryInterface.dropTable('Comments');
  }
};