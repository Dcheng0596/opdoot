'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Facebook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Facebook.belongsTo(models.User);
    }
  };
  Facebook.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.BIGINT
    }
  }, {
    sequelize,
    modelName: 'Facebook',
  });
  return Facebook;
};