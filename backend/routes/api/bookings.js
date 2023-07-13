const express = require('express');

const bcrypt = require('bcryptjs');
const { Validator } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking} = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
    }));

    res.json({Bookings: currBookings});

});







module.exports = router;