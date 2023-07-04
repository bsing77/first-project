'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      );
      Review.belongsTo(
        models.Spot,
        {foreignKey: 'spotId'}
      );
      Review.hasMany(
        models.ReviewImage,
        {foreignKey: 'reiewId'}
      )
    }
  }
  Review.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model:'Spot', key: 'id'},
      onDelete: 'CASCADE'
      },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: 'User', key: 'id'},
      onDelete: 'CASCADE'
    },
    review: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, 
        max: 5,
      }
    },
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};