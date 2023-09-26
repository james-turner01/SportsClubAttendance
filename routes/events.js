const express = require('express');
const router = express.Router();
//requiring catchAsync wrapper function
const catchAsync = require('../utils/catchAsync');
//requiring isLoggedIn middleware
const {isLoggedIn, validateEvent, isEventAuthor} = require('../middleware')

//require events controller
const events = require('../controllers/events');

// crrating a post route for a new event
router.post('/new', isLoggedIn, validateEvent, catchAsync(events.createEvent))

router.route('/:id')
    //get request for a scheduled event
    .get(catchAsync(events.showEvent))
    //creating put request for event
    .put(isLoggedIn,  isEventAuthor, validateEvent, catchAsync(events.updateEvent))
    //delete route for a event
    .delete(isLoggedIn,  isEventAuthor, catchAsync(events.deleteEvent))

// get route to edit a fixture session
router.get('/:id/edit', isLoggedIn, isEventAuthor, catchAsync(events.renderEventEditForm))

module.exports = router;