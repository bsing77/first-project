const express = require('express');

const bcrypt = require('bcryptjs');
const { Validator } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateCreateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage("Street address is required"),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({checkFalsy: true})
      .withMessage('State is required'),
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
     check('lat')
      .exists({checkFalsy: true})
      .isDecimal()
      .withMessage("Latitude is not valid"),
    check('lat')
    .exists({checkFalsy: true})
    .custom ( async value => {
        if (value < -90 || value > 90){
            throw new Error ('Lattitude is not valid')
        }
    }),
    check('lng')
      .exists({checkFalsy: true})
      .isDecimal()
      .withMessage('Longitude is not valid'),
    check ('lng')
    .exists({checkFalsy: true})
    .custom( async value => {
        if(value < -180 || value > 180  ){
            throw new Error('Longitude is not valid')
        }
    }),
    check('name')
      .exists({checkFalsy: true})
      .isLength({max:50})
      .withMessage('Name must be less than 50 characters'),
    check('name')
      .exists({checkFalsy: true})
      .notEmpty()
      .withMessage("Name is required"),
    check('description')
      .exists({checkFalsy: true})
      .withMessage('Description is required'),
    check('price')
      .exists({checkFalsy: true})
      .withMessage('Price per day is required'),
    
    handleValidationErrors
  ];

  const validateReview = [
    check('review')
      .exists({checkFalsy: true})
      .withMessage('Review text is required'),
    check('stars')
      .exists({checkFalsy: true})
      .withMessage('Stars must be an integer from 1 to 5'),
    check('stars')
      .exists({checkFalsy: true})
      .custom( async value => {
        if(value < 1 || value > 5){
          throw new Error('Stars must be an integer from 1 to 5')
        }
      }),

    handleValidationErrors
  ];
  // Create a spot image
  router.post('/:spotId/images', requireAuth, async (req,res) => {
    const {url,preview} = req.body; 
    const {spotId} = req.params.spotId
    const spot = await Spot.findOne({
        where: {ownerId: req.user.id, id: req.params.spotId}
    })
    if(!spot){

        res.statusCode = 404;
        res.json({message: 'Spot couldn\'t be found'})
    };

    const spotImage = await SpotImage.create({spotId:spot.id,url,preview});
    //  console.log(spotImage.id)
    const image = await SpotImage.scope('defaultScope').findOne({where: {id: spotImage.id}})
    res.json(image);
  });
  // Create a Review for a spot
  router.post('/:spotId/reviews',requireAuth,validateReview, async (req,res) => {
      const spotId = req.params.spotId;
      const spot = await Spot.findOne({where: {id: spotId}});
      const {review, stars} = req.body; 

      if(!spot){
        res.statusCode = 404; 
        res.json({message: 'Spot couldn\'t be found'})
      };
       const userReview = await Review.findOne({where: {userId: req.user.id, spotId: spotId}});
       if(userReview){
        res.statusCode = 403; 
        res.json({message: 'User already has a review for this spot'})
       };

       const currReview = await Review.create({userId:req.user.id,spotId: spotId,review,stars});
       res.json(currReview); 
  })

    //  Create a Spot
  router.post( "/", requireAuth, validateCreateSpot, async(req,res) => {
      const{address,city,state,country,lat,lng,name,description,price} = req.body
      
      const spot = await Spot.create({ownerId:req.user.id,address,city,state,country,lat,lng,name,description,price})
      
      res.json(spot)
    });
    
    // Get spots by current user
    router.get("/current",requireAuth, async (req,res) => {
      const spots = await Spot.findAll({ where: {
          ownerId: req.user.id
        },
        include:{
            model: SpotImage,
            attributes: ['url']
        },
        
    });
      let spotArray = []
      
      for(let i = 0; i< spots.length; i++){
          let spot = spots[i];
          let {id,ownerId,address,city,state,country,lat,lng,name,description,price, createdAt, updatedAt} = spot; 
            let image = await SpotImage.findOne({
                where: {spotId: id , preview: true}, 
                attributes: ['url']
                
            })
            
          const newSpot = {
              id,ownerId,address,city,state,country,lat,lng,name,description,price,
              createdAt,
              updatedAt,
              avgStarRating: 4.5,
              preview: image.url
          }
          spotArray.push(newSpot)
      }
      if(spots) {
          res.json( {Spots : spotArray})
      }
  
  
    })




    // Get All Spots
  router.get('/', async (req,res) => {
    const spots =  await Spot.findAll({include:{
      model: SpotImage,
      attributes: ['url']
  },});
  let spotArray = []
      
      for(let i = 0; i< spots.length; i++){
          let spot = spots[i];
          let {id,ownerId,address,city,state,country,lat,lng,name,description,price, createdAt, updatedAt} = spot; 
            let image = await SpotImage.findOne({
                where: {spotId: id , preview: true}, 
                attributes: ['url']
                
            })
            
          const newSpot = {
              id,ownerId,address,city,state,country,lat,lng,name,description,price,
              createdAt,
              updatedAt,
              avgStarRating: 4.5,
              preview: image.url
          }
          spotArray.push(newSpot)
      }
      if(spots) {
          res.json( {Spots : spotArray})
      }

  
  })





module.exports = router;