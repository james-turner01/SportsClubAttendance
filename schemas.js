// JOI SCHEMAS for server side validation
//require sanitizeHtml package
const sanitizeHtml = require('sanitize-html');

//************
//creating our extension on Joi.string() called escapeHTML that ensures string input does NOT include any html
const extension = (joi) => ({
    type: 'string',
    base: joi.string(), //our extension works on joi.string()s
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: { //extension is called escapeHTML
            validate(value, helpers) { //function called validate, Joi will call this automatically with whatever 'value' it receives
                // using a npm pacakge called sanitize-html https://www.npmjs.com/package/sanitize-html
                const clean = sanitizeHtml(value, { // clean = the sanitized html. clean shoudl === value by the time sanitizeHtml has executed
                    allowedTags: [], // no html tags or attributes are allowed
                    allowedAttributes: {},
                });
                // if value and clean do not match, then something has been removed so return string.escapeHTML message
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
//****************

//require Joi and Joi date extension
//adding our extension to base Joi so we can use it in our Joi schema below
// so now we can use escapeHTML extension we made above
const Joi = require('joi').extend(require('@joi/date')).extend(extension);
// require objectId validation for joi
Joi.objectId = require('joi-objectid')(Joi)



// require ExpressError (our own defined Error class)
const ExpressError = require('./utils/ExpressError');

// function for trainingSchema
const dateNDaysLater = function(n) {
    const date = new Date();
    date.setDate(date.getDate() + n);
    // console.log(date.toISOString().split('T')[0])
    return date.toISOString().split('T')[0]
}

// custom validator to check the start and endTime when the start and end dates are the same
// an error message is raised when the startDate === endDate and when startTime > endTime
const eventTimeValidation = (doc, helper) => {
    const startDate = doc.event.date.toLocaleDateString('en-CA');
    const endDate = doc.event.endDate.toLocaleDateString('en-CA');
    //console.log(startDate)
    //console.log(endDate)
    if (startDate === endDate) {
        // throw an error if startTime is less than endTime
        if (doc.event.startTime > doc.event.endTime) {
            return helper.message('Start time must be greater than the end time!')
        }
    }
    // return the value unchanged
    return doc;
}

// defining our Joi Schema for training - this will validate our data before it is saved to Mongoose
module.exports.trainingSchema = Joi.object({
    training: Joi.object({
        // keys nested in training
        location: Joi.string().required().escapeHTML(),
        date: Joi.date().min(dateNDaysLater(0)).required(),
        startTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().escapeHTML(),
        endTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        meetTime: Joi.number().valid(0, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120).required(),
        repeat: Joi.string().valid('on', 'off').required().escapeHTML(),
        repeatEnd: Joi.when('repeat', {is :'on', then: Joi.date().min(dateNDaysLater(7)).required(), otherwise: Joi.valid('', null)})
    }).required()
})

// defining our Joi schema for fixtures - this will validate our data before it is saved to Mongoose
module.exports.fixtureSchema = Joi.object({
    fixture: Joi.object({
        // keys nested in fixture
        team: Joi.string().valid('1s', '2s', '3s').required().escapeHTML(),
        opponent: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        venue: Joi.string().valid('Home', 'Away').required().escapeHTML(),
        date: Joi.date().min(dateNDaysLater(0)).required(),
        startTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().escapeHTML(),
        endTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().escapeHTML(),
        meetTime: Joi.number().valid(0, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120).required(),
    })
}).required()

//defining our Joi schema for events - this will validate our data before it is saved to Mongoose
module.exports.eventSchema = Joi.object({
    event: Joi.object({
        title: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        date: Joi.date().min(dateNDaysLater(0)).required(),
        startTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().escapeHTML(),
        meetTime: Joi.number().valid(0, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120).required(),
        endDate: Joi.date().min(dateNDaysLater(0)).required(),
        endTime: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required().escapeHTML(),
    })
}).custom(eventTimeValidation).required()

// defining our Joi schema for attendants - this will validate our data before it is saved to Mongoose
module.exports.attendantSchema = Joi.object({
    attendant: Joi.object({
        // keys nested in attendant
        going: Joi.string().valid('1', '2', '3').required().escapeHTML(), // 1=going, 2=not going, 3=no answer
        note: Joi.string().allow('').escapeHTML(), // string by default si not allowed to be empty
    }).required()
})