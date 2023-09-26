//define activity model
const Activity = require ('../models/activity');

//requiring helper.js
const helper = require('../public/javascripts/helper');

module.exports.renderSchedule = async (req, res) => {
    //get the first 10 activities using pagination - when there is no query string on the href (i.e. no ?page=x)
    if (!req.query.page) {
        const activities = await Activity.paginate({date: {$gte: new Date().setHours(0,0,0,0)}}, {
            populate: {
                path: 'activity_data',
                select: '-attendants'
            },
            sort: {
                date: 1,
                // "activity_data.startTime": 1,
            }
        })
        console.log("all activities", activities)
        res.render('index', { activities, helper, title : 'Upcoming' })
    } else { // when req.query does have a value for page (e.g. /schedule?page=2)
        // set page value to be req.query.page
        const {page} = req.query;
        // get the activities data for the page value
        const activities = await Activity.paginate({date: {$gte: new Date().setHours(0,0,0,0)}}, {
            page, // enter page number as an argument to get correct oage data
            populate: {
                path: 'activity_data',
                select: '-attendants'
            },
            sort: {date: 1}
        })
        console.log("activities", activities)
        res.status(200).json(activities)   
    }
    // console.log(trainings)
    // res.render('index', { fixtures, trainings, events, activities, helper })
}

module.exports.renderPastSchedule = async (req, res) => {
    //get the first 10 activities using pagination - when there is no query string on the href (i.e. no ?page=x)
    if (!req.query.page) {
        const activities = await Activity.paginate({date: {$lt: new Date().setHours(0,0,0,0)}}, {
            populate: {
                path: 'activity_data',
                select: '-attendants'
            },
            sort: {date: -1}
        })
        console.log(activities)
        res.render('index', { activities, helper, title : 'Past' })
    } else { // when req.query does have a value for page (e.g. /schedule?page=2)
        // set page value to be req.query.page
        const {page} = req.query;
        // get the activities data for the page value
        const activities = await Activity.paginate({date: {$lt: new Date().setHours(0,0,0,0)}}, {
            page, // enter page number as an argument to get correct oage data
            populate: {
                path: 'activity_data',
                select: '-attendants'
            },
            sort: {date: 1}
        })
        console.log("activities", activities)
        res.status(200).json(activities)   
    }
}