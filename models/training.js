//require mongoose
const mongoose = require("mongoose");
// require attendant model
const Attendant = require('./attendant');

const Schema = mongoose.Schema;

//creating our trainiing session schema
const TrainingSchema = new Schema({
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        // min: [new Date().setHours(0, 0, 0, 0), // makes sure the date enetered is todays date at midnight (hrs, mins, secs, ms)
        //     "TRAINING MUST BE TODAY'S DATE OR LATER!"],
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    meetTime: {
        type: Number,
        required: true,
        default: 0,
        enum: [0, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120],

    },
    repeat: { // will only have repeat property if repeat checkbox is ticked
        type: String,
        required: true,
        enum: ['on', 'off']
    },
    repeatEnd: {
        type: [Date,"must be a date!!!!"],
        required: function () {
            return this.repeat === "on";
        },
        min: [function () {
            const end = new Date(this.date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
            return end
        }, "MUST BE 7 DAYS AFTER START DATE"]
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

// creating a mongoose 'findOneAndDelete' middleware that is trigerred when findOneAndDelete occurs on a training session (this happens in our training delete route)
// this middleware will run POST a training session is deleted
// doc = the training session that would have just been deleted in the delete route
TrainingSchema.post('findOneAndDelete', async function (doc) {
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
module.exports = mongoose.model('Training', TrainingSchema)