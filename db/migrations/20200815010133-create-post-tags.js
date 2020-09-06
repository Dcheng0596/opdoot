'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PostTags', {
      PostFile: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'Posts',
          key: 'file'
        }
      },
      TagId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Tags',
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
    await queryInterface.dropTable('PostTags');
  }
};