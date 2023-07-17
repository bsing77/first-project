'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');
let options = {};
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
}
module.exports = {
 up : (queryInterface, Sequelize)  => {
  options.tableName = "Bookings";
  return queryInterface.bulkInsert(options,[
    {spotId: 1,
      userId: 2,
      startDate: '2023-08-12',
      endDate: '2023-08-19'
    },{
      spotId: 2,
      userId: 3,
      startDate: '2023-08-12',
      endDate: '2023-08-19'
    }, {
      spotId: 3,
      userId: 1,
      startDate: '2023-08-12',
      endDate: '2023-08-19'
    }
  ], {})
  
  },

  down: (queryInterface, Sequelize) => {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1,2,3] }
    }, {});
  }
};
