const express = require('express');
const router = express.Router();
//requiring catchAsync wrapper function
const catchAsync = require('../utils/catchAsync');
//requiring isLoggedIn middleware
const {isLoggedIn, validateFixture, isFixtureAuthor} = require('../middleware')


//requiring fixtures controller
const fixtures = require('../controllers/fixtures');

// creating a post route for a fixture session
router.post('/new', isLoggedIn, validateFixture, catchAsync(fixtures.createFixture))


router.route('/:id')
    //get request for a scheduled fixture
    .get(catchAsync(fixtures.showFixture))
    //creating put request for fixture
    .put(isLoggedIn, isFixtureAuthor, validateFixture, catchAsync(fixtures.updateFixture))
    //delete route for a fixture
    .delete(isLoggedIn, isFixtureAuthor, catchAsync(fixtures.deleteFixture))

// get route to edit a fixture session
router.get('/:id/edit', isLoggedIn, isFixtureAuthor, catchAsync(fixtures.renderFixtureEditForm))

module.exports = router;