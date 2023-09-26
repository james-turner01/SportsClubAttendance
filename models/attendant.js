const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    going: {
        type: String,
        default: '3',
        enum: ['1', '2', '3'],
        required: true,
    },
    note: {
        type: String,
    },
    event_id: {
        type: Schema.Types.ObjectId,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

module.exports = mongoose.model("Attendant", attendanceSchema)

// we will connect mutliple attendants to a training session/ fixture/ event
// so this will be a ONE TO MANY RELATIONSHIP
// we will embed an array of object ids of attendants 