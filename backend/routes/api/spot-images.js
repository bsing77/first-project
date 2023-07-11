const express = require('express');

const bcrypt = require('bcryptjs');
const { Validator } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req,res) => {
    const  imageId = req.params.imageId; 
    const image = await SpotImage.scope(null).findOne({where: {id: imageId}});
    // const {spotId, url} = image
    if (!image){
        res.statusCode = 404; 
        res.json({message: 'Spot Image couldn\'t be found'});
        
    const spot = await Spot.findOne({where: {id: image.spotId}});
// console.log(image.spotId)

    

    if(spot.ownerId !== req.user.id){
        res.statusCode = 403; 
        res.json({message: 'Forbbiden'});
    };

    };
    await image.destroy();
    res.json({message: 'Successfully deleted'})

    // res.json(image)
    // res.json(spot)
});






module.exports = router;