const { S3_BUCKET_URL } = require('../../config/amazon');

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
      User.hasMany(models.Comment),
      User.hasOne(models.Facebook),
      User.hasOne(models.Google),
      User.belongsToMany(models.Post, { as: 'postOpdoots', through: models.PostOpdoot })
      User.belongsToMany(models.Comment, { as: 'commentOpdoots', through: models.CommentOpdoot })
    }
  };
  User.init({
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    password: {
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
    },
    posts: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    about: {
      type: DataTypes.CHAR(1000),
    },
    profilePicture: {
      allowNull: false,
      defaultValue: S3_BUCKET_URL + '/' + "users/default-user-image.jpg",
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};