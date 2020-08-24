'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Google extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Google.belongsTo(models.User);
    }
  };
  Google.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.CHAR(50)
    }
  }, {
    sequelize,
    modelName: 'Google',
  });
  return Google;
};