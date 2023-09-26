// define Team model
const Team = require('../models/team');
//defeine the Training model
const Training = require('../models/training');
//define Activity model
const Activity = require('../models/activity');

//requiring helper.js
const helper = require('../public/javascripts/helper');

module.exports.renderNewForm = async (req, res) => {
    // checks to see if the logged in user is an admin, if they are NOT, redirect to the schedule
    if(req.user.isAdmin !== 0 && req.user.isAdmin !== 1) {
        console.log("ADMIN IS FALSE")
        req.flash('error', 'You do not have permission to add activities.')
        return res.redirect('/schedule')
    }
    // find all team from teams collection in mongodb and sort into alphabetical order (by name)
    const teams = await Team.find({}).sort('name');
    res.render('training/new', {teams})
}

module.exports.createTraining = async (req, res) => {
    // get info about the training session we want to save
    const trainingInfo = req.body.training
    console.log("TRAINING INFO BEFORE EDITS", trainingInfo)
    // // putting the data submitted from the form into Training model
    if (trainingInfo.repeat === 'on') {
        // get the repeat dates
        const repeatDates = helper.getDatesInRange(new Date(trainingInfo.date), (new Date(trainingInfo.repeatEnd)));
        console.log("REPEAT DATES", repeatDates);
        //delete repeatEnd
        trainingInfo["repeatEnd"] = null;
        trainingInfo["repeat"] = 'off';
        // creating the training sessions
        for (let date of repeatDates) {
            // console.log(date)
            trainingInfo["date"] = date;
            const training = new Training(trainingInfo)
            // adding author for training session
            training.author = req.user._id;
            console.log("TRAINING TO SAVE: ", training)
            // adding the training session to the activity model
            const activityInfo = {
                activity_type: "training",
                activity_data: training._id,
                activity_model: "Training",
                //date: training.date,
                date: new Date(new Date().setTime(new Date(training.date).getTime()+Number(training.startTime.slice(0,2))*60*60*1000 + Number(training.startTime.slice(3))*60*1000))
            }
            const activity = new Activity(activityInfo)
            console.log("ACTIVITY TO SAVE:", activity)

            //save the activity and training session
            await activity.save();
            await training.save();
        }
        req.flash('success', 'Successfully created new training sessions!');
    } else {
        //create new training session if REPEAT = FALSE
        const training = new Training(trainingInfo)
        // adding author for training session
        training.author = req.user._id;
        console.log("TRAINING TO SAVE: ", training)

        // adding the training session to the activity model
        const activityInfo = {
            activity_data: training._id,
            activity_model: "Training",
            // setting the activity date to include the startTime in the Date (i.e. YYYY-MM-DDTHH.MM.SS.MSMSZ)
            date: new Date(new Date().setTime(new Date(training.date).getTime()+Number(training.startTime.slice(0,2))*60*60*1000 + Number(training.startTime.slice(3))*60*1000))
        }
        console.log("training time PLUS startTime hours and mins", new Date(new Date().setTime(new Date(training.date).getTime()+Number(training.startTime.slice(0,2))*60*60*1000 + Number(training.startTime.slice(3))*60*1000)))
        const activity = new Activity(activityInfo)
        console.log("ACTIVITY TO SAVE:", activity)
        //save the activity
        await activity.save();
        //save the training session
        await training.save();

        req.flash('success', 'Successfully created a new training session!');
    }
    //redirect to the index page where all sessions are displayed
    res.redirect('/schedule')
}

module.exports.showTraining = async (req, res) => {
    const training = await Training.findById(req.params.id).populate({
        path: 'attendants', 
        options: {sort: {'going': 1}},
        // populates the 'authors' of those who have added their attendance 
        populate: {
            path: 'author',
        },
    }) //populate the attendants array with the full objects for each attendant
    console.log(training)
    res.render('training/show', {training, helper})
}

module.exports.renderTrainingEditForm = async (req, res) => {
    const {id} = req.params;
    const training = await Training.findById(id)
    if(!training) {
        req.flash('error', 'Training session not found!');
        res.redirect('/schedule');
    }
    res.render('training/edit', {training})
}

module.exports.updateTraining = async (req, res) => {
    // getting the id of the training session
    const {id} = req.params;
    // find the training session and update it
    const training = await Training.findByIdAndUpdate(id, {...req.body.training})
    console.log("TRAINING", training)
    //find the activity that stores data about this training session and update activity.date
    const activity = await Activity.findOneAndUpdate({activity_data: id}, {date: new Date(new Date().setTime(new Date(req.body.training.date).getTime()+Number(req.body.training.startTime.slice(0,2))*60*60*1000 + Number(req.body.training.startTime.slice(3))*60*1000))})
    console.log("ACTIVITY", activity)
    req.flash('success', 'Successfully updated training session!')
    res.redirect(`/training/${training._id}`)
}

module.exports.deleteTraining = async (req, res) => {
    const {id} = req.params;
    // find the training by id (will need this when deleting any data ASSOCIATED with the training session - e.g. who is/isn't attending)
    await Training.findByIdAndDelete(id)
    // find the activity referring to this training session and elete it
    await Activity.findOneAndDelete({activity_data: id})
    req.flash('success', 'Successfully deleted training session!')
    res.redirect('/schedule')
}