'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');
let options = {};
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
}
module.exports = {
 up : (queryInterface, Sequelize)  => {
  options.tableName = "Reviews";
  return queryInterface.bulkInsert(options,[
    {spotId: 1,
      userId: 1,
      review: "this was a great spot",
      stars: 5,
    },{
      spotId: 2,
      userId: 2,
      review: "Loved it",
      stars: 5,
    }, {
      spotId: 3,
      userId: 3,
      review: "It was ok",
      stars: 3
    }
  ], {})
  
  },

  down: (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1,2,3] }
    }, {});
  }
};
