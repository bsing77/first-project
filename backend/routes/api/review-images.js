const express = require('express');

const bcrypt = require('bcryptjs');
const { Validator } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req,res) => {
    const revImage =  await ReviewImage.findOne({where: {id: req.params.imageId}});

    if(revImage.id !== req.params.imageId){
        res.statusCode = 404; 
        res.json({ message: 'Review Image couldn\'t be found'});
    }
})





module.exports = router;