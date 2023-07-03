const express = require('express');

const bcrypt = require('bcryptjs');
const { Validator } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage } = require('../../db/models');

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

  router.post('/:spotId/images', requireAuth, async (req,res) => {
    const {url,preview} = req.body; 
    const {spotId} = req.params.spotId
    const spot = await Spot.findOne({
        where: {ownerId: req.user.id}
    })
    if(!spot){

        res.statusCode = 404;
        res.json({message: 'Spot couldn"t be found'})
    };

    const spotImage = await SpotImage.create({spotId:spot.id,url,preview});
     console.log(spotImage.id)
    const image = await SpotImage.scope('defaultScope').findOne({where: {id: spotImage.id}})
    res.json(image);
  });

  
  router.post( "/", requireAuth, validateCreateSpot, async(req,res) => {
      const{address,city,state,country,lat,lng,name,description,price} = req.body
      
      const spot = await Spot.create({ownerId:req.user.id,address,city,state,country,lat,lng,name,description,price})
      
      res.json(spot)
    });
    
    
    router.get("/current",requireAuth, async (req,res) => {
      const spots = await Spot.findAll({ where: {
          ownerId: req.user.id
      }});
      let spotArray = []
      for(let i = 0; i< spots.length; i++){
          let spot = spots[i];
          let {id,ownerId,address,city,state,country,lat,lng,name,description,price, createdAt, updatedAt} = spot; 
            let image = await SpotImage.findOne({
                where: {spotId: spot.id , preview: true},
                
            })
          const newSpot = {
              id,ownerId,address,city,state,country,lat,lng,name,description,price,
              createdAt,
              updatedAt,
              avgStarRating: 4.5,
              previewImage: image.url,
              createdAt,
            
          }
          spotArray.push(newSpot)
      }
      if(spots) {
          res.json( {Spots : spotArray})
      }
  
  
    })





  router.get('/', async (req,res) => {
    const spots =  await Spot.findAll();
    let spotArray = []
    for(let i = 0; i< spots.length; i++){
        let spot = spots[i];
        let {ownerId,address,city,state,country,lat,lng,name,description,price} = spot; 

        const newSpot = {
            ownerId,address,city,state,country,lat,lng,name,description,price,
            avgStarRating: 4.5,
            previewImage: "url"
        }
        spotArray.push(newSpot)
    }
    if(spots) {
        res.json(spotArray)
    }

  
  })





module.exports = router;