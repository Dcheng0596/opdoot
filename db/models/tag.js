'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tag.belongsToMany(models.Post, { 
        through: models.PostTag, 
      });
    }
  };
  Tag.init({
    name: {
      allowNull: false,
      type: DataTypes.CHAR(32)
    },
    count: {
      allowNull: false,
      defaultValue: 1,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};