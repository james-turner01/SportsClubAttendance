const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// require mongoose pagination package
const mongoosePaginate = require('mongoose-paginate-v2');

const activitySchema = new Schema({
    // https://mongoosejs.com/docs/populate.html#dynamic-ref
    activity_data: {
        // the objeect id of the full activity (e.g. training, fixture or event)
        type: Schema.Types.ObjectId,
        required: true,
        // dynamic ref - means can refer to mutliple models
        refPath: 'activity_model'
    },
    activity_model: {
        type: String,
        required: true,
        enum: ['Training', 'Fixture', 'Event']
    },
    date: {
        type: Date,
        required: true,
    },
})

// adds the mongoose pagination package
activitySchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Activity", activitySchema)