'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostOpdoot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PostOpdoot.belongsTo(models.OpdootType)
    }
  };
  PostOpdoot.init({
    
  }, {
    sequelize,
    modelName: 'PostOpdoot',
  });
  return PostOpdoot;
};