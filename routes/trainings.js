const express = require('express');
const router = express.Router();
//requiring catchAsync wrapper function
const catchAsync = require('../utils/catchAsync');
//requiring isLoggedIn, validateTraining, isTrainingAuthor middleware
const {isLoggedIn, validateTraining, isTrainingAuthor} = require('../middleware')

//require trainings controller
const trainings = require('../controllers/trainings');

router.route('/new')
    //get route for adding a training session, fixture or event
    .get(isLoggedIn, catchAsync(trainings.renderNewForm))
    //post route to create new training session(s)
    .post(isLoggedIn, validateTraining, catchAsync(trainings.createTraining))

router.route('/:id')
    //get request for a scheduled training
    .get(catchAsync(trainings.showTraining))
    //creating put request for training session
    .put(isLoggedIn, isTrainingAuthor, validateTraining, catchAsync(trainings.updateTraining))
    //delete a training session
    .delete(isLoggedIn, isTrainingAuthor, catchAsync(trainings.deleteTraining))

// get route to edit a training session
router.get('/:id/edit', isLoggedIn, isTrainingAuthor, catchAsync(trainings.renderTrainingEditForm))


module.exports = router;