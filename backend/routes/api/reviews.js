const express = require('express');

const bcrypt = require('bcryptjs');
const { Validator } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();
// Create an Image for a reivew
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
    // console.log(rImage)
    const image = await ReviewImage.scope('defaultScope').findOne({where:{ id: rImage.id}});

   


    res.json(image)
})


// Get Reviews of Current User'

router.get('/current', requireAuth, async (req,res) => {
    const reviews = await Review.findAll({where: {userId: req.user.id},
    include:[
        {model: User,
        attributes: ['id', 'firstName', 'lastName']},
        {
            model:Spot,
            attributes: ['id','ownerId','address','city','state','country','lat','lng','name','price',],
            include: {model:SpotImage, as:'previewImages', where:{ preview: true}, attributes: ['url']}
        },{
            model: ReviewImage,
            attributes: ['id', 'url'],
            
        }
    ]
    })

    const newReviews = reviews.map((review) => ({
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: {
          id: review.User.id,
          firstName: review.User.firstName,
          lastName: review.User.lastName,
        },
        Spot: {
          id: review.Spot.id,
          ownerId: review.Spot.ownerId,
          address: review.Spot.address,
          city: review.Spot.city,
          state: review.Spot.state,
          country: review.Spot.country,
          lat: review.Spot.lat,
          lng: review.Spot.lng,
          name: review.Spot.name,
          price: review.Spot.price,
          previewImage: review.Spot.previewImages.url
        },
        ReviewImages: review.ReviewImages.map((image) => ({
          id: image.id,
          url: image.url,
        })),
      }));

    console.log (reviews.preiveiwImages.url);
    res.json({Reviews:newReviews })
})









module.exports = router;