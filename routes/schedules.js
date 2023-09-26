const express = require('express');
const router = express.Router();
//requiring catchAsync wrapper function
const catchAsync = require('../utils/catchAsync');

//requiring schedules controller
const schedules = require('../controllers/schedules')

//get reuqest for schedule
router.get('/', catchAsync(schedules.renderSchedule))

//get reuqest for PAST ACTIVITIES schedule
router.get('/past', catchAsync(schedules.renderPastSchedule))

module.exports = router;