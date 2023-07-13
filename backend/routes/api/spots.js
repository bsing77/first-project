const express = require('express');

const bcrypt = require('bcryptjs');
const { Validator } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, } = require('../../db/models');

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

  // const validateBookings = [
  //   check('startDate')
  //     .exists({checkFalsy: true})
  //     .custom( async value => {
  //       if (Date.parse(value) > Date.parse(this.endDate)){
  //         throw new Error("startDate must be before endDate")
  //       }
  //     }),
    

  //   handleValidationErrors
  // ];

  

  // Create a spot image
  router.post('/:spotId/images', requireAuth, async (req,res) => {
    const {url,preview} = req.body; 
    const {spotId} = req.params.spotId
    const spot = await Spot.findOne({
      where: {id: req.params.spotId}
    });
    const oldPreviewImage = await SpotImage.findOne({where: {spotId: req.params.spotId, preview: true}});

    if(!spot){
      
      res.statusCode = 404;
      res.json({message: 'Spot couldn\'t be found'})
    }

    else if(spot.ownerId !== req.user.id){
      res.statusCode = 403;
      res.json({message: 'Forbidden'});
    }

     else if(!oldPreviewImage){
      const spotImage = await SpotImage.create({spotId:spot.id,url,preview});
      //  console.log(spotImage.id)
      const image = await SpotImage.scope('defaultScope').findOne({where: {id: spotImage.id}})
      res.json(image); 
    }
     else {
      res.json({message: 'Can only have one preview image per spot'});
    }
    
    
  });
  // Create a Review for a spot
  router.post('/:spotId/reviews',requireAuth,validateReview, async (req,res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findOne({where: {id: spotId}});
    const {review, stars} = req.body; 
    const userReview = await Review.findOne({where: {userId: req.user.id, spotId: spotId}});
    console.log(spot.ownerId);
    if(!spot){
      res.statusCode = 404; 
      res.json({message: 'Spot couldn\'t be found'})
    } 
    else if(spot.ownerId === req.user.id){
      
      res.statusCode = 403; 
      res.json({message: 'Forbidden'})
    }
     else if(userReview){
      res.statusCode = 403; 
      res.json({message: 'User already has a review for this spot'})
    } else {

      const currReview = await Review.create({userId:req.user.id,spotId: parseInt(req.params.spotId),review,stars});
       res.json(currReview);  
    }
    
  })

  // Create a booking from a pot based on the spot's id

  router.post('/:spotsId/bookings', requireAuth, async (req,res) => {
    const {startDate, endDate} = req.body; 

    const spot = await Spot.findOne({where:{id: req.params.spotsId}});
    if(!spot){
      res.statusCode = 404; 
      res.json({message: 'Spot couldn\'t be found'});
    }
    
    else if(req.user.id === spot.ownerId){
      res.statusCode = 403; 
      res.json({message: 'Forbidden'});
    }
    else if(Date.parse(startDate) > Date.parse(endDate)){
      res.satusCode = 400;
      res.json({message:" Bad Request", errors:{ endDate: 'endDate cannot be on or before startDate'}});
    }
    else {
      
      const bookings = await Booking.findAll({where:{spotId: spot.id }});
      for(let i = 0; i < bookings.length; i++){
        let booking = bookings[i];
        console.log(booking);
        
        
        if(Date.parse(startDate) >= Date.parse(booking.startDate) && Date.parse(startDate) <= Date.parse(booking.endDate) &&  Date.parse(endDate) >= Date.parse(booking.startDate) && Date.parse(endDate) <= Date.parse(booking.endDate) ){
          res.statusCode = 403; 
          res.json({message: 'Sorry, this spot is already booked for the specified dates', errors: {startDate:'Start date conflicts with an existing booking', endDate: 'End date conflicts with an existing booking'}})
        };
        if(Date.parse(startDate) >= Date.parse(booking.startDate) && Date.parse(startDate) <= Date.parse(booking.endDate)){
          res.statusCode = 400; 
          res.json({message: 'Sorry this spot is already booked for the specified dates', errors: {startDate: 'Start date conflicts with an existing booking'}})
        };
        if(Date.parse(endDate) >= Date.parse(booking.startDate) && Date.parse(endDate) <= Date.parse(booking.endDate)){
          res.statusCode = 403; 
          res.json({message: 'Sorry this spot is already booked for the specified dates', errors: { endDate: 'End date conflicts with an existing booking'}})
        };
      }
      
      const currBooking = await Booking.create({spotId: spot.id, userId: req.user.id,startDate, endDate});
      // console.log(Date.parse(startDate) > Date.parse(endDate))
      res.json(currBooking); 

    };
    
  })
  
  //  Create a Spot
router.post( "/", requireAuth, validateCreateSpot, async(req,res) => {
    const{address,city,state,country,lat,lng,name,description,price} = req.body
    
    const spot = await Spot.create({ownerId:req.user.id,address,city,state,country,lat,lng,name,description,price})
    
    res.json(spot)
  });

    // Edit a Spot

    router.put('/:spotId', requireAuth, validateCreateSpot, async (req,res) => {
      const spotId = req.params.spotId;
      let {id,ownerId,address,city,state,country,lat,lng,name,description,price,createdAt} = req.body
      const spot = await Spot.findOne({where: {id: spotId}}); 
      if(!spot){
        res.statusCode = 404; 
        res.json({message: 'Spot couldn\'t be found'});
      };
      const currSpot = await spot.update({id,ownerId,address,city,state,country,lat,lng,name,description,price,createdAt, updatedAt: new Date("CURRENT_TIMESTAMP")});

      res.json(currSpot)
    })

    // Get spots by current user
    router.get("/current",requireAuth, async (req,res) => {
      const spots = await Spot.findAll({ where: {
          ownerId: req.user.id
        },
        include:{
            model: SpotImage,
            as: 'previewImages',
            attributes: ['url']
        },
        
    });
      let spotArray = []
      
      for(let i = 0; i< spots.length; i++){
          let spot = spots[i];
          let {id,ownerId,address,city,state,country,lat,lng,name,description,price, createdAt, updatedAt} = spot; 
            let image = await SpotImage.findOne({
                where: {spotId: id, preview: true}, 
                attributes: ['url']
                
            })
            
            const reviewStar =  await Review.sum('stars',{where: {spotId : spot.id}})
            // console.log(reviewStar)
            
            const totalStars = await Review.count({where: {spotId: spot.id}})
            console.log(totalStars)
            const avgStars = reviewStar/totalStars
            
          const newSpot = {
              id,ownerId,address,city,state,country,lat,lng,name,description,price,
              createdAt,
              updatedAt,
              avgStarRating: avgStars,
              preview: image.url
          }
          spotArray.push(newSpot)
      }
      if(spots) {
          res.json( {Spots : spotArray})
      }
  
  
    })
    // Get all Bookings by a Spot's id

    router.get('/:spotId/bookings', requireAuth, async (req,res) => {

      const spot = await Spot.findOne({ where: {id: req.params.spotId}})
      
      
      if(!spot){
        res.statusCode = 404;
        res.json({message: 'Spot couldn\'t be found'})
      } 
      
      else if(spot.ownerId === req.user.id){
        
        const currUserBookings = await Booking.scope(null).findAll({where: {spotId: spot.id , userId: req.user.id},
          include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          }
        });
        console.log(currUserBookings);
        
        const newBooking = currUserBookings.map((booking) => ({
          User: {
            id: booking.User.id,
            firstName: booking.User.firstName,
            lastName: booking.User.lastName
          },
          id: booking.id,
          spotId: booking.spotId,
          userId: booking.userId,
          startDate: booking.startDate,
          endDate: booking.endDate,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
        }));
        
        console.log(newBooking);
        
        res.json({Bookings: newBooking});
      } else {
        const bookings = await Booking.findAll({where: {spotId: spot.id}});

        res.json({Bookings: bookings});
      };

      
       // const spotBooking = bookings.map((booking)  => ({
         //   User: {
           //     id: booking.User.id,
           //     firstName: booking.User.firstName,
           //     lastName: booking.User.lastName
           //   },
           //   id: booking.id,
           //   userId: booking.userId,
           //   startDate: booking.startDate,
           //   endDate: booking.endDate,
           //   createdAt: booking.createdAt,
           //   updatedAt: booking.updatedAt,
           // }));
           
           
          });
         
      


    // Get all Reviews by a Spot's Id
    router.get('/:spotId/reviews', async (req,res) => {
      const spotId = req.params.spotId; 

      const spot = await Spot.findOne ( {where:{id: spotId}});

      if(!spot){
        res.statusCode = 404; 
        res.json({message: 'Spot couldn\'t be found'});
      }

      const reviews = await Review.findAll({where: 
        {spotId: spotId}, 
        include:[ {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }, 
      {model:ReviewImage,
      attributes: ['id','url' ]}]
        })
        
        res.json(reviews);
    })


    // Get details of a Spot from an id

    router.get('/:spotId', async (req,res) => {
      const spotId = req.params.spotId; 
      const spot = await Spot.findOne({where: {id: spotId},
        include: {
          model: SpotImage,
          attributes: ['id', 'url','preview'],
          as:'previewImages'
        
        },
        
        
      });
      if(!spot){
        res.statusCode= 404;
        res.json({message: 'Spot couldn\'t be found'})
      }
      // console.log(spot)
    let {id,ownerId,address,city,state,country,lat,lng,name,description,price,createdAt,updatedAt} = spot; 
    
    const reviewStar =  await Review.sum('stars',{where: {spotId : spot.id}})
    // console.log(reviewStar)
    
    const totalStars = await Review.count({where: {spotId: spot.id}});
    // console.log(totalStars)
    const avgStars = reviewStar/totalStars;

    const user = await User.findOne({where: {id: ownerId}, attributes: ['id', 'firstName','lastName']})
    // console.log(user)
    const newSpot = {
      id,ownerId,address,city,state,country,lat,lng,name,description,price,createdAt,updatedAt,
      numReviews: totalStars,
      avgStarRating: avgStars,
      SpotImages: spot.previewImages,
      Owner: user
    }


    res.json(newSpot)
  });
    




    // Get All Spots
  router.get('/', async (req,res) => {
    const spots =  await Spot.findAll({include:{
      model: SpotImage,
      as: 'previewImages',
      attributes: ['url']
  },});
  let spotArray = []
      
      for(let i = 0; i< spots.length; i++){
          let spot = spots[i];
          let {id,ownerId,address,city,state,country,lat,lng,name,description,price, createdAt, updatedAt} = spot; 
            let image = await SpotImage.findOne({
                where: {spotId: id, preview: true}, 
                attributes: ['url']
                
            })
            
            const reviewStar =  await Review.sum('stars',{where: {spotId : spot.id}})
            // console.log(reviewStar)
            
            const totalStars = await Review.count({where: {spotId: spot.id}})
            console.log(totalStars)
            const avgStars = reviewStar/totalStars
            
          const newSpot = {
              id,ownerId,address,city,state,country,lat,lng,name,description,price,
              createdAt,
              updatedAt,
              avgStarRating: avgStars,
              preview: spot.previewImages[0].url
          }
          spotArray.push(newSpot)
      }
      if(spots) {
          res.json( {Spots : spotArray})
      }

  
  });

  router.delete('/:spotId', requireAuth, async (req,res) => {
    const spotId = req.params.spotId;

    const spot = await Spot.findOne({where: {id: spotId}});



    if(!spot){
      res.statusCode = 404;
      res.json({message: 'Spot couldn\'t be found'}); 
    };

    if(req.user.id !== spot.ownerId){
      res.statusCode = 403;
      res.json({message: 'Forbidden'});
    }

    await spot.destroy(); 
    res.json({message: 'Successfully deleted'})
  })





module.exports = router;