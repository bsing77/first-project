const express = require('express');

const bcrypt = require('bcryptjs');
const { Validator } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// Edit a booking

router.put('/:bookingId', requireAuth, async (req,res) => {
    const booking = await Booking.scope(null).findOne({where: {id: req.params.bookingId}});
    const {id, spotId, userId,startDate, endDate, createdAt, updatedAt} = req.body;
    const today = Date.now();
    // console.log(today)
     if(!booking){
      res.statusCode = 404; 
      res.json({ message: 'Booking couldn\'t be found'});

    }
      else if(booking.userId !== req.user.id){
        res.statusCode = 403; 
        res.json({message: 'Forbidden'});
    } else if (Date.parse(booking.startDate) <= today ){
      res.statusCode = 403; 
      res.json({message:'Past bookings can\'t be modified'});
    }
    else if(Date.parse(startDate) > Date.parse(endDate)){
        res.satusCode = 400;
        res.json({message:" Bad Request", errors:{ endDate: 'endDate cannot be on or before startDate'}});
      } 
        else if(Date.parse(startDate) >= Date.parse(booking.startDate) && Date.parse(startDate) <= Date.parse(booking.endDate) &&  Date.parse(endDate) >= Date.parse(booking.startDate) && Date.parse(endDate) <= Date.parse(booking.endDate) ){
        res.statusCode = 403; 
            res.json({message: 'Sorry, this spot is already booked for the specified dates', errors: {startDate:'Start date conflicts with an existing booking', endDate: 'End date conflicts with an existing booking'}})
    }
       else if(Date.parse(startDate) >= Date.parse(booking.startDate) && Date.parse(startDate) <= Date.parse(booking.endDate)){
            res.statusCode = 400; 
            res.json({message: 'Sorry this spot is already booked for the specified dates', errors: {startDate: 'Start date conflicts with an existing booking'}})
    }
     else if(Date.parse(endDate) >= Date.parse(booking.startDate) && Date.parse(endDate) <= Date.parse(booking.endDate)){
            res.statusCode = 403; 
            res.json({message: 'Sorry this spot is already booked for the specified dates', errors: { endDate: 'End date conflicts with an existing booking'}})
    } else {
      const updatedBooking = await booking.update({id, spotId,userId,startDate, endDate, createdAt, updatedAt: new Date('CURRENT_TIMESTAMP')}) 

      const newBooking = updatedBooking.toJson(); 

      newBooking.createdAt = newBooking.createdAt.toISOString().slice(0,19).replace('T', ' ');
      newBooking.updatedAt = newBooking.updatedAt.toISOString().slice(0,19).replace('T', ' ');


        res.json(updatedBooking);
    }
         
});

// Get all bookings by current user
router.get('/current', requireAuth, async (req,res) => {
    const bookings = await Booking.scope(null).findAll({where: {userId: req.user.id },
    include :  {
        model: Spot,
        attributes: ['id','ownerId','address','city','state','country','lat','lng','name','price',],
        include: {model:SpotImage, as:'previewImages', where:{ preview: true}, attributes: ['url']}
      }, 
   
    });

    const currBookings = bookings.map((booking) => ({
        id: booking.id,
        spotId: booking.spotId,
        Spot:{
            id: booking.Spot.id,
            ownerId: booking.Spot.ownerId,
            address: booking.Spot.address,
            city: booking.Spot.city,
            state: booking.Spot.state,
            country: booking.Spot.country,
            lat: booking.Spot.lat,
            lng: booking.Spot.lng,
            name: booking.Spot.name,
            price: booking.Spot.price,
            previewImage: booking.Spot.previewImages[0].url
        },
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt.toISOString().slice(0,19).replace('T', ' '),
        updatedAt: booking.updatedAt.toISOString().slice(0,19).replace('T', ' '),
    }));

//   console.log(currBookings)
//   currBookings[0].createdAt = currBookings[0].createdAt.toISOString().slice(0,19).replace('T', ' ');
//   currBookings[0].updatedAt = currBookings[0].updatedAt.toISOString().slice(0,19).replace('T', ' '); 

    res.json({Bookings: currBookings});

});

// Delete a booking

router.delete('/:bookingId', requireAuth, async (req,res) => {
    const booking = await Booking.findOne({where: {id: req.params.bookingId},
        include: {
            model: Spot,
            attributes:['id', 'ownerId']
        }
    });
    const today = Date.now();
    if(!booking){
        res.statusCode = 404; 
        res.json({message: 'Booking couldn\'t be found'})
    }
    else if (Date.parse(booking.startDate) <= today){
        res.statusCode = 403; 
        res.json({message: 'Bookings that have started can\'t be deleted'})
    }
    else if (booking.userId !== req.user.id || booking.spot.ownerId !== req.user.id){
        res.statusCode = 403; 
        res.json({message: 'Forbidden'});
    } 
    else {
        await booking.destroy(); 
        res.json({message: 'Successfully deleted'});
    }
});






module.exports = router;