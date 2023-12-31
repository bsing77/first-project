const express = require('express');

const bcrypt = require('bcryptjs');
const { Validator } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage("Invalid email"),
    
    check('username')
      .exists({checkFalsy: true})
      .custom(async value => {
        if(value.trim().length === 0){
            throw new Error('Username is required')
        }
      }), 
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('password')
      .exists({checkFalsy: true})
      .custom(async value => {
        if(value.trim().length === 0){
            throw new Error('Password is required')
        }
      }), 
     check('firstName')
      .exists({checkFalsy: true})
      .withMessage("First Name is requried"),
    check('firstName')
      .exists({checkFalsy: true})
      .custom(async value => {
        if(value.trim().length === 0){
            throw new Error('First Name is required')
        }
      }), 
    check('lastName')
      .exists({checkFalsy: true})
      .withMessage('Last Name is required'),
    check('lastName')
      .exists({checkFalsy: true})
      .custom(async value => {
        if(value.trim().length === 0){
            throw new Error('Last Name is required')
        }
      }), 
    handleValidationErrors
  ];

router.post(
    '/',
    validateSignup,
    async (req, res, ) => {
      const { email,firstName, lastName, password, username,  } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      // if(!Validator.isEmail(email)){
      //   res.statusCode = 400;
      //   return res.json({message: "Bad Request", errors: {email: "Invalid email"}})
      // };

      // if( !username ){
      //   res.statusCode = 400; 
      //   return res.json({message: 'Bad Request', errors: {username: "Username is required"}})
      // };

      // if(!firstName || firstName.isLength < 4){
      //   res.statusCode = 400;
      //   res.json({message: 'Bad Request', errors : { firstName: 'First Name is required'}})
      // };

      // if(!lastName || lastName.length < 4){
      //   res.statusCode = 400; 
      //   res.json({message: 'Bad Request', errors: { lastName: "Last Name is required"}})
      // };

      const currUserByUsername = await User.findOne({where: {
        username: username
      }}) ;
      // console.log(currUserByUsername);

      if (currUserByUsername){
        res.statusCode = 500;
        return res.json({message: "User already exists", errors: { username: 'User with that username already exsits'}})
      };
      const currUserByEmail = await User.findOne({where: {email: email}});
     


      if(currUserByEmail){
       res.statusCode = 500;
       return res.json({message: 'User already exsits', errors: { email:'User with that email already exits' }})
      };


      const user = await User.create({ email, firstName, lastName,username, hashedPassword });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );

module.exports = router;