const express = require('express');

const bcrypt = require('bcryptjs');
const { Validator } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.post('/:reviewId/images', requireAuth, async (req,res) => {
    const reviewId = req.params.reviewId; 
    const {url} = req.body; 

    const review = await Review.findOne({where:{id: reviewId} });

    if(!review){
        res.statusCode = 404; 
        res.json({message: 'Review couldn\'t be found'});
    };
    if(req.user.id !== review.userId){
        res.statusCode = 403; 
        res.json({message: 'Forbbiden'})
    };
    
    const imageCount = await ReviewImage.count('url', {where: { reviewId: review.id} })
    if(imageCount > 10 ){
        res.statusCode = 403; 
        res.json({message: 'Maximum number of images for this resource was reached'})
    }
    const rImage = await ReviewImage.create({reviewId: review.id, url});
    console.log(rImage)
    const image = await ReviewImage.scope('defaultScope').findOne({where:{ id: rImage.id}});

   


    res.json(image)
})









module.exports = router;