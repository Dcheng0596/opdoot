'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('OpdootTypes', [{
      name: 'upvote',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'downvote',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OpdootTypes', null, {});
  }
};