//require mongoose
const mongoose = require("mongoose");
// require attendant model
const Attendant = require('./attendant');

const Schema = mongoose.Schema;

//creating our trainiing session schema
const EventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        min: new Date().setHours(0, 0, 0, 0), // makes sure the date enetered is todays date at midnight (hrs, mins, secs, ms)
    },
    startTime: {
        type: String,
        required: true,

    },
    meetTime: {
        type: Number,
        required: true,
        default: 0,
        enum: [0, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120],
    },
    endDate: {
        type: Date,
        required: true,
        min: [function () {
            const end = new Date(this.date.getTime() + 0 * 24 * 60 * 60 * 1000).toISOString();
            return end
        }, "MUST BE BE EITHER THE SAME OR AFTER THEN START DATE"]
    },
    endTime: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    attendants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Attendant' // reference is the Attendant model
        }
    ],
})

// creating a mongoose 'findOneAndDelete' middleware that is trigerred when findOneAndDelete occurs on a event (this happens in our fixture delete route)
// this middleware will run POST a deletion of a event
// doc = the event that has just been deleted in the delete route
EventSchema.post('findOneAndDelete', async function (doc) {
    // if a doc (training session) was found and deleted
    if (doc) {
        console.log("DELETED!!!")
        console.log(doc)
        console.log(doc.attendants)
        // delete all reviews that have an _id inside doc.reviews
        await Attendant.deleteMany({
            _id: {
                $in: doc.attendants
            }
        })
    }
})

//converting our schema to a model and exporting it
module.exports = mongoose.model('Event', EventSchema)