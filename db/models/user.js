'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post),
      User.belongsToMany(models.Post, { through: models.PostOpdoot })
      User.belongsToMany(models.Post, { through: models.CommentOpdoot })
      User.belongsToMany(models.Comment, { through: models.UserComment });
    }
  };
  User.init({
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    totalOpdoots: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    views: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};