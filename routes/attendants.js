const express = require('express');
const router = express.Router({mergeParams: true}); //,ergeParams: true ensures means that the params in of app.js and the router in attendants.js are MERGED together so can be accessed in both js files
//requiring catchAsync wrapper function
const catchAsync = require('../utils/catchAsync');
//import middleware
const {isLoggedIn, validateAttendant} = require('../middleware')

//require attendants controller
const attendants = require('../controllers/attendants');


// PUT route for attendance of TRAINGIN SESSION
router.route('/training/:id/attendance') 
    .put(isLoggedIn, validateAttendant, catchAsync(attendants.updateTrainingAttendant))


// PUT route for attendance of FIXTURE
router.route('/fixture/:id/attendance')
    .put(isLoggedIn, validateAttendant, catchAsync(attendants.updateFixtureAttendant))

// PUT route for attendance of EVENT
router.route('/event/:id/attendance')
    .put(isLoggedIn, validateAttendant, catchAsync(attendants.updateEventAttendant))


module.exports = router;

