//defeine the Training model
const Training = require('../models/training');
//define fixture model
const Fixture = require('../models/fixture');
//define event model
const Event = require ('../models/event');
//defeine the Attendant model
const Attendant = require('../models/attendant');

module.exports.updateTrainingAttendant = async(req,res) => {
    const training = await Training.findById(req.params.id)

    // tries to find an attendant with the user id for the current training session
    const currentAttendanceCheck = await Attendant.find({event_id: req.params.id, author: req.user._id})
    console.log("array", currentAttendanceCheck, currentAttendanceCheck.length)
    
    //if it does find an attendee, update the going and note parts of the attendant entry
    if(currentAttendanceCheck.length > 0) {
        console.log("Attending already or not?", true)
        // what we want to update for user who has already added attednance
        const update = {
            going: req.body.attendant.going,
            note: req.body.attendant.note
        }
        //updating the attendant entry
        const updatedAttendant = await Attendant.findOneAndUpdate({event_id: req.params.id, author: req.user._id}, update)
        console.log(updatedAttendant)
        req.flash('success', 'Successfully added your attendance!')
        //res.redirect(`/training/${training._id}`)
        res.status(404)
    // if this user has not added their attednace to this session before, create a new attendant entry
    } else {
        console.log("attending already or not?", false)
        console.log("NOT ADDED ATTENDANCE YET")
        const attendant = new Attendant(req.body.attendant);
        attendant.author = req.user._id;
        attendant.event_id = req.params.id; 
        training.attendants.push(attendant);
        await training.save();
        await attendant.save();
        req.flash('success', 'Successfully added your attendance!')
        //res.redirect(`/training/${training._id}`)
        res.status(404)
    }
}

module.exports.updateFixtureAttendant = async(req, res) => {
    // add the attendance to the corresponding training session
    const fixture = await Fixture.findById(req.params.id);

    // tries to find an attendant with the user id for the current training session
    const currentAttendanceCheck = await Attendant.find({event_id: req.params.id, author: req.user._id})
    //console.log("array", currentAttendanceCheck, currentAttendanceCheck.length)
    
    //if it does find an attendee, update the going and note parts of the attendant entry
    if(currentAttendanceCheck.length > 0) {
        console.log("Attending already or not", true)
        // what we want to update for user who has already added attednance
        const update = {
            going: req.body.attendant.going,
            note: req.body.attendant.note
        }
        //updating the attendant entry
        const updatedAttendant = await Attendant.findOneAndUpdate({event_id: req.params.id, author: req.user._id}, update)
        console.log(updatedAttendant)
        req.flash('success', 'Successfully added your attendance!')
        //res.redirect(`/fixture/${fixture._id}`)
        res.status(404)
    // if this user has not added their attednace to this session before, create a new attendant entry
    } else {
        console.log("attending already or not", false)
        console.log("NOT ADDED ATTENDANCE YET")
        const attendant = new Attendant(req.body.attendant);
        attendant.author = req.user._id;
        attendant.event_id = req.params.id; 
        // push the attendant onto the attendants array
        fixture.attendants.push(attendant);
        await fixture.save();
        await attendant.save();
        req.flash('success', 'Successfully added your attendance!')
        //res.redirect(`/fixture/${fixture._id}`)
        res.status(404)
    }
}

module.exports.updateEventAttendant = async(req, res) => {
    // add the attendance to the corresponding training session
    const event = await Event.findById(req.params.id);
    
    // tries to find an attendant with the user id for the current training session
    const currentAttendanceCheck = await Attendant.find({event_id: req.params.id, author: req.user._id})
    
    //if it does find an attendee, update the going and note parts of the attendant entry
    if(currentAttendanceCheck.length > 0) {
        console.log("Attending already or not", true)
        // what we want to update for user who has already added attednance
        const update = {
            going: req.body.attendant.going,
            note: req.body.attendant.note
        }
        //updating the attendant entry
        const updatedAttendant = await Attendant.findOneAndUpdate({event_id: req.params.id, author: req.user._id}, update)
        console.log(updatedAttendant)
        req.flash('success', 'Successfully added your attendance!')
        //res.redirect(`/event/${event._id}`)
        res.status(404)
    // if this user has not added their attednace to this session before, create a new attendant entry
    } else {
        console.log("attending already or not", false)
        console.log("NOT ADDED ATTENDANCE YET")
        const attendant = new Attendant(req.body.attendant);
        attendant.author = req.user._id;
        // add an id for the event to help find it
        attendant.event_id = req.params.id; 
        // push the attendant onto the attendants array
        event.attendants.push(attendant);
        await event.save();
        await attendant.save();
        req.flash('success', 'Successfully added your attendance!')
        res.status(404)
    }
}