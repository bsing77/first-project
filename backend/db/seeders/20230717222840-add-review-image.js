'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');
let options = {};
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
}
module.exports = {
 up : (queryInterface, Sequelize)  => {
  options.tableName = "ReviewImages";
  return queryInterface.bulkInsert(options,[
    {reviewId: 1,
      url: 'Image 1 review url'
    },{
      reviewId: 2,
      url: 'Image 2 review url'
    }, {
      reviewId: 3,
      url: 'Image 3 review url'
    }
  ], {})
  
  },

  down: (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1,2,3] }
    }, {});
  }
};