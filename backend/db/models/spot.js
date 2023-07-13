'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(
        models.User,
        {foreignKey: 'ownerId'}
      );
      Spot.hasMany(
        models.SpotImage,
        {as: 'previewImages',foreignKey: 'spotId', onDelete: 'CASCADE'}
      );
      Spot.hasMany(
        models.Review,
        {foreignKey: 'spotId', onDelete: 'CASCADE'}
      );
      Spot.hasMany(
        models.Booking,
        {foreignKey: 'spotId', onDelete: 'CASCADE'}
      )
    }

  }
  Spot.init({
    ownerId: {
      type:DataTypes.INTEGER,
      allowNull: false,
      references: {model:'User', key: 'id'},
      // onDelete: 'CASCADE'
    },
    address: {
      type:DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Street address is required'
      },
      validate: {
        notEmpty:{
          args: true,
          msg:'Street address is requried'
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'City is required'
      }, 
      validate: {
        notEmpty: {
          args: true,
          msg: 'City is required'
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'State is required'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'State is required'
        }
      }
  },
    country: {
      type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'Country is required'
    },
    validate: {
      notEmpty: {
        args: true,
        msg:'Country is required'
      }
    }
  },
    lat: {
      type: {
        args: DataTypes.DECIMAL(9,7),
        msg: 'Latitude is not valid'
    },
    allowNull: {
      args: false,
      msg: 'Latitude is not valid'
    },
    validate: {
      notEmpty: {
        args: true,
        msg: 'Latitude is not valid'
      }
    }
  },
    lng: {
     type: {
      args: DataTypes.DECIMAL(9,7),
      msg: 'Longitude is not valid'
     },
     allowNull: {
      args: false,
      msg: 'Longitude is not valid'
     },
     validate: {
      notEmpty: {
        args: true,
        msg: 'Lonitude is not valid'
      }
     }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { 
          args:true,
        msg: "Name must be less than 50 characters"},
        len: {
          args: [3,49],
          msg: "Name must be less than 50 characters"
        }, 
    },
  },
    description: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Description is required'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Description is required'
        }
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: {
        args: false,
        msg: 'Price per day is required'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Price per day is required'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};