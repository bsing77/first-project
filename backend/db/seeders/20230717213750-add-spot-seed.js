'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');
let options = {};
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
}
module.exports = {
 up : (queryInterface, Sequelize)  => {
  options.tableName = "Spots";
  return queryInterface.bulkInsert(options,[
    {ownerId: 1,
    address: '96 Clyde St',
    city: "Pawtucket",
    state: 'Rhode Island',
    country: 'United States of America',
    lat: 41.86591,
    lng: 71.39072,
    name: 'My House',
    description: 'Where I live',
    price: 125,
    },{
      ownerId: 2,
    address: '100 Broadway',
    city: "Pawtucket",
    state: 'Rhode Island',
    country: 'United States of America',
    lat: 41.87744,
    lng: 71.38061,
    name: 'Living Hope International ',
    description: 'My church',
    price: 200,
    }, {
      ownerId: 3,
      address: '110 Broadway',
      city: "Pawtucket",
      state: 'Rhode Island',
      country: 'United States of America',
      lat: 41.87743,
      lng: 71.38062,
      name: 'Brown House',
      description: 'My first appartment',
      price: 155,
    }
  ], {})
  
  },

  down: (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1,2,3] }
    }, {});
  }
};
