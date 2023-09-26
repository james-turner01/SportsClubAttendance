//define fixture model
const Fixture = require('../models/fixture');
//define Activity model
const Activity = require('../models/activity');
// define Team model
const Team = require('../models/team');

//requiring fixtureOpponent.js
const fixtureOpponent = require('../public/javascripts/fixtureOpponent');
//requiring helper.js
const helper = require('../public/javascripts/helper');

module.exports.createFixture = async (req, res) => {
    // store the output of the form to variable
    const fixtureInfo = req.body.fixture;
    console.log(fixtureInfo)
    // create the new fixture
    const fixture = new Fixture(fixtureInfo)
    // adding author for fixture session
    fixture.author = req.user._id;
    console.log("new fixture made")
    // check to see if the opponent is one that is saved in database, if not add it to databse in teams collection
    fixtureOpponent.isOpponentNew(fixtureInfo.opponent);

    // adding the training session to the activity model
    const activityInfo = {
        activity_data: fixture._id,
        activity_model: "Fixture",
        //date: fixture.date,
        date: new Date(new Date().setTime(new Date(fixture.date).getTime()+Number(fixture.startTime.slice(0,2))*60*60*1000 + Number(fixture.startTime.slice(3))*60*1000))
    }
    const activity = new Activity(activityInfo)
    console.log("ACTIVITY TO SAVE:", activity)

    //save the activity
    await activity.save();
    //save the fixture
    await fixture.save();
    console.log("saved")

    req.flash('success', 'Successfully created added a new fixture!');
    //redirect to the index page where all sessions are displayed
    res.redirect('/schedule')
}

module.exports.showFixture = async (req, res) => {
    const fixture = await Fixture.findById(req.params.id).populate({
        path: 'attendants', 
        options: {sort: {'going': 1}},
        // populates the 'authors' of those who have added their attendance 
        populate: {
            path: 'author'
        },
    }) //populate the attendants array with the full objects for each attendant
    console.log(fixture);
    if(!fixture) {
        req.flash('error', 'Fixture not found!');
        res.redirect('/schedule');
    }
    res.render('fixture/show', {fixture, helper})
}

module.exports.renderFixtureEditForm = async (req, res) => {
    const fixture = await Fixture.findById(req.params.id)
    // find all team from teams collection in mongodb and sort into alphabetical order (by name)
    const teams = await Team.find({}).sort('name');
    if(!fixture) {
        req.flash('error', 'Fixture not found!');
        res.redirect('/schedule');
    }
    res.render('fixture/edit', {fixture, teams})
}

module.exports.updateFixture = async (req, res) => {
    // getting the id of the training session
    const {id} = req.params;
    // access the traiing session by it's id and update it
    const fixture = await Fixture.findByIdAndUpdate(id, {...req.body.fixture})
    console.log(fixture)
    //find the activity that stores data about this training session and update activity.date
    const activity = await Activity.findOneAndUpdate({activity_data: id}, {date: new Date(new Date().setTime(new Date(req.body.fixture.date).getTime()+Number(req.body.fixture.startTime.slice(0,2))*60*60*1000 + Number(req.body.fixture.startTime.slice(3))*60*1000))})
    console.log("ACTIVITY", activity)
    // check to see if the opponent is one that is saved in database, if not add it to databse in teams collection
    fixtureOpponent.isOpponentNew(req.body.fixture.opponent);
    req.flash('success', 'Fixture updated!');
    res.redirect(`/fixture/${fixture._id}`)
}

module.exports.deleteFixture = async (req, res) => {
    const {id} = req.params;
    // find the training by id (will need this when deleting any data ASSOCIATED with the fixture - e.g. who is/isn't attending)
    await Fixture.findByIdAndDelete(id)
    // find the activity referring to this training session and elete it
    await Activity.findOneAndDelete({activity_data: id})
    req.flash('success', 'Fixture deleted!');
    res.redirect('/schedule')
}