'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User);
      Post.belongsToMany(models.User, { through: models.PostOpdoot, sourceKey: 'file'});
      Post.belongsToMany(models.Tag, { through: models.PostTag, sourceKey: 'file' });
      Post.belongsToMany(models.Comment, { through: models.PostComment, sourceKey: 'file' });
    }
  };
  Post.init({
    file: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING
    },
    title: {
      allowNull: false,
      defaultValue: "",
      type: DataTypes.CHAR(100)
    },
    width: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    height: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    description: {
      allowNull: false,
      defaultValue: "",
      type: DataTypes.CHAR(200)
    },
    opdoots: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    views: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    public: {
      allowNull: false,
      defaultValue: true,
      type: DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};