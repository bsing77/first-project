const express = require('express');

const bcrypt = require('bcryptjs');
const { Validator, Op } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, } = require('../../db/models');

const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateCreateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage("Street address is required"),
    check('address')
      .exists({checkFalsy: true})
      .custom(async value => {
        if(value.trim().length === 0){
            throw new Error('Street address is required')
        }
      }), 
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('city')
      .exists({checkFalsy: true})
      .custom(async value => {
        if(value.trim().length === 0){
            throw new Error('City is required')
        }
      }), 
    check('state')
      .exists({checkFalsy: true})
      .withMessage('State is required'),
  check('state')
      .exists({checkFalsy: true})
      .custom(async value => {
        if(value.trim().length === 0){
            throw new Error('State is required')
        }
      }),      
    check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
    check('country')
      .exists({checkFalsy: true})
      .custom(async value => {
        if(value.trim().length === 0){
            throw new Error('Country is required')
        }
      }), 
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
     check('name')
      .exists({checkFalsy: true})
      .custom(async value => {
        if(value.trim().length === 0){
            throw new Error('Name is required')
        }
      }), 
    check('description')
      .exists({checkFalsy: true})
      .withMessage('Description is required'),
    check('description')
      .exists({checkFalsy: true})
      .custom(async value => {
        if(value.trim().length === 0){
            throw new Error('Description is required')
        }
      }), 
    check('price')
      .exists({checkFalsy: true})
      .withMessage('Price per day is required'),
    
    handleValidationErrors
  ];

  const validateReview = [
    check('review')
      .exists({checkFalsy: true})
      .withMessage('Review text is required'),
    check('review')
      .exists({checkFalsy: true})
      .custom(async value => {
        if(value.trim().length === 0){
            throw new Error('Review text is required')
        }
      }), 
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

  const validateQueries = [
    query('page')
      .optional(true)
      .isInt({min:1 , max: 10})
      .withMessage('Page must be greater than or equal to 1'),
    query('size')
      .optional(true)
      .isInt({min: 1, max: 20})
      .withMessage("Size must be greater than or equal to 1"),
    query('maxLat')
      .optional(true)
      .isFloat({min: -90, max: 90})
      .withMessage('Maximum latitude is invalid'),
    query('minLat')
      .optional(true)
      .isFloat({min: -90, max: 90})
      .withMessage('Minimum latitude is invalid'),
    query('minLng')
      .optional(true)
      .isFloat({min: -180, max: 180})
      .withMessage('Minimum longitude is invalid'),
    query('maxLng')
      .optional(true)
      .isFloat({min: -180, max: 180})
      .withMessage('Maximum longitude is invaled'),
    query('minPrice')
      .optional(true)
      .isFloat({min: 0})
      .withMessage('Minimum price must be greater than or equal to 0'),
    query('maxPrice')
      .optional(true)
      .isFloat({min: 0})
      .withMessage('Maximum price must be greater tha or equal to 0'),
    

    handleValidationErrors
  ];

  

  // Create a spot image
  router.post('/:spotId/images', requireAuth, async (req,res) => {
    const {url,preview} = req.body; 
    const {spotId} = req.params.spotId
    const spot = await Spot.findOne({
      where: {id: req.params.spotId},
      
    });
    const oldPreviewImage = await SpotImage.findOne({where:
        { id: {[Op.eq]: req.param.id}, preview: {[Op.eq]: true}}
       });

    if(!spot){
      
      res.statusCode = 404;
      res.json({message: 'Spot couldn\'t be found'})
    }

    else if(spot.ownerId !== req.user.id){
      res.statusCode = 403;
      res.json({message: 'Forbidden'});
    }

     else if(oldPreviewImage){
       res.json({message: 'Can only have one preview image per spot'});
    }
    else {
      const spotImage = await SpotImage.create({spotId:spot.id,url,preview});
      //  console.log(spotImage.id)
      const image = await SpotImage.scope('defaultScope').findOne({where: {id: spotImage.id}})
      res.json(image); 
    }
    
    
  });
  // Create a Review for a spot
  router.post('/:spotId/reviews',requireAuth,validateReview, async (req,res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findOne({where: {id: spotId}});
    const {review, stars} = req.body; 
    const userReview = await Review.findOne({where: {userId: req.user.id, spotId: spotId}});
    // console.log(spot.ownerId);
    if(!spot){
      res.statusCode = 404; 
      res.json({message: 'Spot couldn\'t be found'})
    } 
    // else if(spot.ownerId === req.user.id){
      
    //   res.statusCode = 403; 
    //   res.json({message: 'Forbidden'})
    // }
     else if(userReview){
      res.statusCode = 403; 
      res.json({message: 'User already has a review for this spot'})
    } else {

      const currReview = await Review.create({userId:req.user.id,spotId: parseInt(req.params.spotId),review,stars});
       res.json(currReview);  
    }
    
  });

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

      const newSpot = currBooking.toJSON(); 
      newSpot.createdAt = newSpot.createdAt.toISOString().slice(0,19).replace('T', ' ');
      newSpot.updatedAt = newSpot.updatedAt.toISOString().slice(0,19).replace('T', ' '); 
      // console.log(Date.parse(startDate) > Date.parse(endDate))
      res.json(newSpot); 

    };
    
  })
  
  //  Create a Spot
router.post( "/", requireAuth, validateCreateSpot, async(req,res) => {
    const{address,city,state,country,lat,lng,name,description,price} = req.body
    
    const spot = await Spot.create({ownerId:req.user.id,address,city,state,country,lat,lng,name,description,price});


  
    const newSpot = spot.toJSON(); 
    newSpot.createdAt = newSpot.createdAt.toISOString().slice(0,19).replace('T', ' ');
    newSpot.updatedAt = newSpot.updatedAt.toISOString().slice(0,19).replace('T', ' '); 
   
    
    res.json(newSpot)
  });

    // Edit a Spot

    router.put('/:spotId', requireAuth, validateCreateSpot, async (req,res) => {
      const spotId = req.params.spotId;
      let {id,ownerId,address,city,state,country,lat,lng,name,description,price,createdAt} = req.body
      const spot = await Spot.findOne({where: {id: spotId}}); 
      if(!spot){
        res.statusCode = 404; 
        res.json({message: 'Spot couldn\'t be found'});
      } else if (spot.ownerId !== req.user.id)  {
        res.statusCode = 403; 
        res.json({message: 'Fobidden'})
      } else {

        const currSpot = await spot.update({id,ownerId,address,city,state,country,lat,lng,name,description,price,createdAt, updatedAt: new Date("CURRENT_TIMESTAMP")});
  
        const newSpot = currSpot.toJSON(); 
        newSpot.createdAt = newSpot.createdAt.toISOString().slice(0,19).replace('T', ' ');
    newSpot.updatedAt = newSpot.updatedAt.toISOString().slice(0,19).replace('T', ' '); 

        res.json(newSpot)
      } 
      
    });

    // Get spots by current user
    router.get("/current",requireAuth, async (req,res) => {
      const spots = await Spot.findAll({ where: {
          ownerId: req.user.id
        },
        // include:{
        //     model: SpotImage,
        //     as: 'previewImages',
        //     attributes: ['url']
        // },
        
    });
      let spotArray = []
      
      for(let i = 0; i< spots.length; i++){
          let spot = spots[i];
          let {id,ownerId,address,city,state,country,lat,lng,name,description,price, createdAt, updatedAt} = spot; 
            let image = await SpotImage.findOne({
              where: {spotId: {[Op.eq] :id}, preview:{ [Op.eq] : true}}, 
              attributes: ['url']
                
            })
            if(!image) {

              const reviewStar =  await Review.sum('stars',{where: {spotId : spot.id}})
                    // console.log(reviewStar)
                    
                    const totalStars = await Review.count({where: {spotId: spot.id}})
                    // console.log(totalStars)
                    const avgStars = reviewStar/totalStars
                    
                  const newSpot = {
                      id,ownerId,address,city,state,country,lat,lng,name,description,price,
                      createdAt,
                      updatedAt,
                      avgStarRating: avgStars,
                      preview: "no preview image"
                  }
                  newSpot.createdAt = createdAt.toISOString().slice(0,19).replace('T', ' ');
                  newSpot.updatedAt = updatedAt.toISOString().slice(0,19).replace('T', ' '); 

                  spotArray.push(newSpot) }

                  else {
                    
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
                  newSpot.createdAt = createdAt.toISOString().slice(0,19).replace('T', ' ');
                  newSpot.updatedAt = updatedAt.toISOString().slice(0,19).replace('T', ' '); 
                  spotArray.push(newSpot)
                  }
            
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
        // console.log(currUserBookings);
        
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
          createdAt: booking.createdAt.toISOString().slice(0,19),
          updatedAt: booking.updatedAt.toISOString().slice(0,19),
        }));
        
        // console.log(newBooking);
        // newBooking[0].createdAt = newBooking[0].createdAt.toISOString().slice(0,19).replace('T', ' ');
        // newBooking[0].updatedAt = newBooking[0].updatedAt.toISOString().slice(0,19).replace('T', ' ');
        
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
      } else {

        const reviews = await Review.findAll({where: 
          {spotId: spotId}, 
          include:[ {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          }, 
        {model:ReviewImage,
        attributes: ['id','url' ]}]
          })
          
          res.json({Reviews: reviews});
      }

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
      } else {

        // console.log(spot)
      let {id,ownerId,address,city,state,country,lat,lng,name,description,price,createdAt,updatedAt} = spot; 
     
      price = parseInt(price);
      lat = new Number(lat)
      lng= new Number(lng);
     
      let reviewStar =  await Review.sum('stars',{where: {spotId : spot.id}})
      // console.log(reviewStar)
      reviewStar = new Number(reviewStar)
      let totalStars = await Review.count({where: {spotId: spot.id}});
      
        totalStars = new Number(totalStars)
      // console.log(totalStars)
      let avgStars = reviewStar/totalStars;
  
      const user = await User.findOne({where: {id: ownerId}, attributes: ['id', 'firstName','lastName']})
      // console.log(user)
      const newSpot = {
        id,ownerId,address,city,state,country,lat,lng,name,description,price,createdAt,updatedAt,
        numReviews: totalStars,
        avgStarRating: avgStars,
        SpotImages: spot.previewImages,
        Owner: user
      }
      newSpot.createdAt = createdAt.toISOString().slice(0,19).replace('T', ' ');
      newSpot.updatedAt = updatedAt.toISOString().slice(0,19).replace('T', ' '); 
  
      res.json(newSpot)
      }
  });
    




    // Get All Spots
  router.get('/', validateQueries, async (req,res) => {
  //   const spots =  await Spot.findAll({include:{
  //     model: SpotImage,
  //     as: 'previewImages',
  //     where: {preview: true},
  //     attributes: ['url']
  // },});
    let {page,size,minLat,maxLat,minLng,maxLng,minPrice,maxPrice} = req.query
    page = parseInt(page);
    size = parseInt(size);
    maxLat = parseInt(maxLat);
    minLat = parseInt(minLat); 
    minLng = parseInt(minLng); 
    maxLng = parseInt(maxLng); 
    minPrice = parseInt(minPrice); 
    maxPrice = parseInt(maxPrice);

    // console.log(page);
    // console.log(size);
    // console.log(maxLat);
    // console.log(minLat);
    // console.log(minLng);
    // console.log(maxLng);
    // console.log(minPrice);
    // console.log(maxPrice);

      if (!page) page = 1; 
      if(!size) size = 20;

    const where = {};

    if(maxLat){
      where.lat = {[Op.lte]: maxLat}
    };
    if(minLat){
      where.lat = {[Op.gte] : minLat}
    };
    if(minLng){
      where.lng = {[Op.gte] :minLng}
    };
    if(maxLng){
      where.lng <= {[Op.lte] : maxLng}
    };
    if(minPrice){
      where.price >= {[Op.gte]: minPrice}
    };
    if(maxPrice){
      where.price <= {[Op.lte]: maxPrice}
    }

  const spots = await Spot.findAll({
    where, offset: (page -1 ) * size,
    limit: size
  });
  let spotArray = []
  
  
  for(let i = 0; i< spots.length; i++){
    let spot = spots[i];
    let {id,ownerId,address,city,state,country,lat,lng,name,description,price, createdAt, updatedAt} = spot; 
    let image = await SpotImage.findOne({
      where: {spotId: {[Op.eq] :id}, preview:{ [Op.eq] : true}}, 
      attributes: ['url']
      
    })
    price = parseInt(price);
    lat = new Number(lat)
    lng= new Number(lng);
    const reviewStar =  await Review.sum('stars',{where: {spotId : spot.id}})
          // console.log(reviewStar)
          
          const totalStars = await Review.count({where: {spotId: spot.id}})
          // console.log(totalStars)
          const avgStars = reviewStar/totalStars
    
    if(!image) {

            
          const newSpot = {
              id,ownerId,address,city,state,country,lat,lng,name,description,price,
              createdAt,
              updatedAt,
              avgStarRating: avgStars,
              preview: "no preview image"
          }
          newSpot.createdAt = createdAt.toISOString().slice(0,19).replace('T', ' ');
          newSpot.updatedAt = updatedAt.toISOString().slice(0,19).replace('T', ' '); 
          spotArray.push(newSpot)
       
    } else {

      // const reviewStar =  await Review.sum('stars',{where: {spotId : spot.id}})
      // // console.log(reviewStar)
      
      // const totalStars = await Review.count({where: {spotId: spot.id}})
      // // console.log(totalStars)
      // const avgStars = reviewStar/totalStars
      
    const newSpot = {
        id,ownerId,address,city,state,country,lat,lng,name,description,price,
        createdAt,
        updatedAt,
        avgStarRating: avgStars,
        preview: image.url
    }
    newSpot.createdAt = createdAt.toISOString().slice(0,19).replace('T', ' ');
    newSpot.updatedAt = updatedAt.toISOString().slice(0,19).replace('T', ' '); 

    spotArray.push(newSpot)
    }
            
      }
      if(spots) {
          res.json( {Spots : spotArray, page,size})
      }

  
  });

  router.delete('/:spotId', requireAuth, async (req,res) => {
    const spotId = req.params.spotId;

    const spot = await Spot.findOne({where: {id: spotId}});



    if(!spot){
      res.statusCode = 404;
      res.json({message: 'Spot couldn\'t be found'}); 
    } else if (req.user.id !== spot.ownerId){
      res.statusCode = 403;
      res.json({message: 'Forbidden'});
    } else {
      
      await spot.destroy(); 
      res.json({message: 'Successfully deleted'})
    }

  })





module.exports = router;