'use strict';
const { S3_BUCKET_URL } = require('../../config/amazon');
const moment = require('moment');

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
      Comment.belongsTo(models.User);
      Comment.belongsToMany(models.User, { as: 'commentOpdoots', through: models.CommentOpdoot });
      Comment.belongsTo(models.Post);
      Comment.belongsTo(models.Comment, {
        as: "Parent",
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  };
  Comment.init({
    comment: {
      allowNull: false,
      defaultValue: '',
      type: DataTypes.CHAR(1000)
    },
    opdoots: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
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
    timeago: {
      type: DataTypes.VIRTUAL,
      get() {
        return moment(this.createdAt).fromNow();
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
    paranoid: true
  });
  return Comment;
};