const router = require('express').Router();
// const { restoreUser } = require('../../utils/auth.js');
const { setTokenCookie } = require('../../utils/auth.js');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const spotImgRouter = require('./spot-images.js');
const revImgRouter = require('./review-images.js');
const bookingRouter = require('./bookings.js');
const { restoreUser } = require("../../utils/auth.js");
const { User } = require('../../db/models');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);
router.use('/reviews', reviewsRouter);
router.use('/spot-images', spotImgRouter);
router.use('/review-images', revImgRouter);
router.use('/bookings', bookingRouter);

// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
//   });
  
//   router.get('/set-token-cookie', async (_req, res) => {
//       const user = await User.findOne({
//           where: {
//               username: 'Demo-lition'
//             }
//         });
//         setTokenCookie(res, user);
//         return res.json({ user: user });
//     });
    
//     router.get(
//       '/restore-user',
//       (req, res) => {
//         return res.json(req.user);
//       }
//     );

//     const { requireAuth } = require('../../utils/auth.js');
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );


module.exports = router;

