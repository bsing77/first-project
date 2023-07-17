'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');
let options = {};
if (process.env.NODE_ENV === "production"){
  options.schema = process.env.SCHEMA;
}
module.exports = {
 up : (queryInterface, Sequelize)  => {
  options.tableName = "SpotImages";
  return queryInterface.bulkInsert(options,[
    {spotId: 1,
      url: "spot1 Image url",
      preview: true,
    },{
      spotId: 2,
      url: "spot2 Image url",
      preview: true,
    }, {
      spotId: 3,
      url: "spot3 Image url",
      preview: true,
    }
  ], {})
  
  },

  down: (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1,2,3] }
    }, {});
  }
};
