'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(
        models.User,
        {foreignKey: 'userId'}
      );
      Booking.belongsTo(
        models.Spot,
        {foreignKey:'spotId'}
      )
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model:'Spot', key: 'id'},
      onDelete: 'CASCADE'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model:'User', key: 'id'},
      onDelete: 'CASCADE'

    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        
          }
        },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        
      }
    },
  }, {
    sequelize,
    modelName: 'Booking',
    
    defaultScope: { 
      attributes: { 
          exclude: [ "id","userId", "createdAt", "updatedAt" ] 
      }  
  },
  // hooks: {
  //   beforeCreate: (record, options) => {
  //     record.dataValues.createdAt = new Date().toISOString().slice(0,19).replace('T', ' ');
  //     record.dataValues.updatedAt = new Date().toISOString().slice(0,19).replace('T', ' ');
  //   },
  //   beforeUpdate: (record, options) => {
  //     record.dataValues.createdAt = new Date().toISOString().slice(0,19).replace('T', ' ');
  //     record.dataValues.updatedAt = new Date().toISOString().slice(0,19).replace('T', ' ');
  //   },
  //   afterCreate: (record, options) => {
  //     record.dataValues.createdAt = new Date().toISOString().slice(0,19).replace('T', ' ');
  //     record.dataValues.updatedAt = new Date().toISOString().slice(0,19).replace('T', ' ');
  //   },
  //   afterUdate: (record, options) => {
  //     record.dataValues.createdAt = new Date().toISOString().slice(0,19).replace('T', ' ');
  //     record.dataValues.updatedAt = new Date().toISOString().slice(0,19).replace('T', ' ');
  //   }
  // },
  });
  return Booking;
};