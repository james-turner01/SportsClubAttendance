//require mongoose
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//creating our trainiing session schema
const TeamSchema = new Schema({
    name: {
        type: String,
        required: true,
    }
})

//converting our schema to a model and exporting it
module.exports = mongoose.model('Team', TeamSchema)