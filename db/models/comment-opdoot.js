'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CommentOpdoot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CommentOpdoot.belongsTo(models.OpdootType)
    }
  };
  CommentOpdoot.init({

  }, {
    sequelize,
    modelName: 'CommentOpdoot',
  });
  return CommentOpdoot;
};