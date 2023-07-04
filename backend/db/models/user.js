'use strict';
const {
  Model, Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Spot, { foreignKey: 'ownerId', onDelete: "CASCADE", hooks: true}, );
      User.hasMany(models.Review, {foreignKey: 'userId', onDelete: 'CASCADE', hooks: true } );
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "User already exisits"
      },
      validate: {
        len: [4,30],
        isNotEmail(value){
          if(Validator.isEmail(value)){
            throw new Error("Cannot be an email.");
          }
        },
        notEmpty: {
          args: true,
          msg: {username: 'Username is required'}
        },
       
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3,30],
      notEmpty: {
          args: true,
          msg: {firstName: "First Name is required"}
        
      }
    }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len:[3,30],
        notEmpty: {
          args: true,
          msg: 'Last Name is required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
        // args: true,
        // msg: {email:'User with that email already exists'}
      // },
      validate : {
        len: [3, 256],
        isEmail:  {
          args: true,
          msg: {email:'Invalid Email'}
        }
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60,60]
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  }
  );
  return User;
};