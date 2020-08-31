'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      file: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      title: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.CHAR(100)
      },
      description: {
        allowNull: false,
        defaultValue: "",
        type: Sequelize.CHAR(200)
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      opdoots: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      views: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      public: {
        allowNull: false,
        defaultValue: true,
        type: Sequelize.BOOLEAN
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Posts');
  }
};