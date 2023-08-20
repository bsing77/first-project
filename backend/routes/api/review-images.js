const express = require('express');

const bcrypt = require('bcryptjs');
const { Validator } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req,res) => {
    const imageId = req.params.imageId
    const revImage =  await ReviewImage.scope(null).findOne({where: {id: imageId}});
    const currReview = await Review.findOne({where: {id: revImage.reviewId}});
    if(!revImage){
        res.statusCode = 404; 
        res.json({ message: 'Review Image couldn\'t be found'});
        // console.log(revImage);
    }
    else if (currReview.userId !== req.user.id){
        res.statusCode = 403; 
        res.json({message: 'Forbidden'});
    }
    else {
        await revImage.destroy(); 
        res.json({message: 'Successfully deleted'});
    }
    res.json(revImage)
})





module.exports = router;