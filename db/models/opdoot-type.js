'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OpdootType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OpdootType.hasOne(models.PostOpdoot);
      OpdootType.hasOne(models.CommentOpdoot);
    }
  };
  OpdootType.init({
    name: {
      allowNull: false,
      type: DataTypes.CHAR(32)
    },
  }, {
    sequelize,
    modelName: 'OpdootType',
  });
  return OpdootType;
};