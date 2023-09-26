//define event model
const Event = require('../models/event');
//define Activity model
const Activity = require('../models/activity');

//requiring helper.js
const helper = require('../public/javascripts/helper');

module.exports.createEvent = async (req, res) => {
    // store the output of the form to variable
    const eventInfo = req.body.event;
    console.log(eventInfo);
    // create a new event 
    const event = new Event(eventInfo);
    // adding author for event session
    event.author = req.user._id;
    console.log("new event made");

    // adding the training session to the activity model
    const activityInfo = {
        activity_data: event._id,
        activity_model: "Event",
        //date: event.date,
        date: new Date(new Date().setTime(new Date(event.date).getTime()+Number(event.startTime.slice(0,2))*60*60*1000 + Number(event.startTime.slice(3))*60*1000))
    }
    const activity = new Activity(activityInfo)
    console.log("ACTIVITY TO SAVE:", activity)

    //save the activity
    await activity.save();
    // save event
    await event.save();


    console.log("saved");
    req.flash('success', 'New event created!');
    //redirect to the index page where all sessions are displayed
    res.redirect('/schedule')
}

module.exports.showEvent = async (req, res) => {
    const event = await Event.findById(req.params.id).populate({
        path: 'attendants', 
        options: {sort: {'going': 1}},
        // populates the 'authors' of those who have added their attendance 
        populate: {
            path: 'author'
        },
    }) //populate the attendants array with the full objects for each attendant
    console.log(event);
    if(!event) {
        req.flash('error', 'Event not found!');
        res.redirect('/schedule');
    }
    res.render('event/show', {event, helper})
}

module.exports.renderEventEditForm = async (req, res, next) => {
    const event = await Event.findById(req.params.id)
    if(!event) {
        req.flash('error', 'Event not found!');
        res.redirect('/schedule');
    }
    res.render('event/edit', {event})
}

module.exports.updateEvent = async (req, res) => {
    // getting the id of the training session
    const {id} = req.params;
    // access the traiing session by it's id and update it
    const event = await Event.findByIdAndUpdate(id, {...req.body.event})
    //find the activity that stores data about this event and update activity.date
    const activity = await Activity.findOneAndUpdate({activity_data: id}, {date: new Date(new Date().setTime(new Date(req.body.event.date).getTime()+Number(req.body.event.startTime.slice(0,2))*60*60*1000 + Number(req.body.event.startTime.slice(3))*60*1000))})
    console.log("ACTIVITY", activity)
    console.log(event)
    req.flash('success', 'Event updated!');
    res.redirect(`/event/${event._id}`)
}

module.exports.deleteEvent = async (req, res) => {  
    const {id} = req.params;
    // find the training by id (will need this when deleting any data ASSOCIATED with the event - e.g. who is/isn't attending)
    await Event.findByIdAndDelete(id)
    // find the activity referring to this event and delete it
    await Activity.findOneAndDelete({activity_data: id})
    req.flash('success', 'Event deleted!');
    res.redirect('/schedule')

}