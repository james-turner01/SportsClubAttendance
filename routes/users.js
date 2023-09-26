// if we are not in production mode, require the dotenv module
// process.env.NODE_ENV is an environment variable that is usually development or production
// if we are running in development mode require thedotenv package
// it will hten take the variables we have defined in our .env file and add them int process.env in our node app
// so we can access them in our files
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
//require catchAsync
const catchAsync = require('../utils/catchAsync');
//require passport 
const passport = require('passport');
// require storeReturnTo middleware
const { storeReturnTo } = require('../middleware');

//require users controller
const users = require('../controllers/users');

router.route('/register')
    //get request to get our registration from
    .get(users.renderRegister)
    // POST request for registering
    .post(catchAsync(users.register))

router.route('/login')
    //get request for login page
    .get(users.renderLogin)
    //post request when logging in
    //passport middleware called passport.authenticate() - to authenticate the login details to passport-local strategy
    // failureFlash: true - automatically flash an error message if login fails
    //failureRedirect: '/login' - if login goes wrong it will redirect to '/login'
    // *** use the storeReturnTo middleware to save the returnTo value from session to res.locals
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout)

module.exports = router;