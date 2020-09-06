'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('PostOpdoots', {
      PostFile: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'Posts',
          key: 'file'
        }
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      OpdootTypeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'OpdootTypes',
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
    await queryInterface.dropTable('PostOpdoots');
  }
};