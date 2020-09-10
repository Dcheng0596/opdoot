'use strict';
const { S3_BUCKET_URL } = require('../../config/amazon');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, { through: models.CommentOpdoot });
      Comment.belongsTo(models.Post);
      Comment.hasMany(models.Comment);
    }
  };
  Comment.init({
    comment: {
      allowNull: false,
      defaultValue: '',
      type: DataTypes.CHAR(1000)
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING
    },
    profilePicture: {
      allowNull: false,
      defaultValue: S3_BUCKET_URL + '/' + "users/default-user-image.jpg",
      type: DataTypes.STRING
    },
    replies: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};