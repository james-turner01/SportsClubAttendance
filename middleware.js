//defeine the Training model
const Training = require('./models/training');
//define fixture model
const Fixture = require('./models/fixture');
//define fixture model
const Event = require('./models/event');
//requiring our Joi Schemas
const {trainingSchema, fixtureSchema, eventSchema, attendantSchema} = require('./schemas');
// require ExpressError (our own defined Error class)
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {    
    // checking that a user is logged in - they must be logged in to add a new campground
    // uses isAuthenticated method from passport (part of req)
    if(!req.isAuthenticated()) {
        // store the req.originalUrl in the session as returnTo - this will be the URL that the user will be redirected to after logging in
        req.session.returnTo = req.originalUrl;
        // req.session.returnTo = req.originalUrl
        req.flash('error', 'Please sign in.')
        return res.redirect('/login')
    }
    // otherwise if you are logged in, call next()
    next()
}

// middleware that will save the storeReturnTo value from the session to res.locals.returnTo
// this middleware must run before passport.authenticate()
// otherwise, if it ran after passport.authenticate() session would have been cleared after a successful login (athentcate())
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

// function that validates training session, using Joi Schema
module.exports.validateTraining = (req, res, next) =>  {
    // extract the error portion (if there is one)
    const {error} = trainingSchema.validate(req.body);
    //  if Joi schema throws an error, throw an Express Erorr to pass on to our error handler route
    if (error) {
        // mapping over 'error' which is an object
        // for each element in the error object, we will join the message of each element and speerate with a comma
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        // if not errors, run next() so it moves on into the route handler
        next()
    }
}

// function that checks that the person trying to edit or delete a training session is the same user that created the session
module.exports.isTrainingAuthor = async(req, res, next) => {
    const {id} = req.params;
    // checks to see if the logged in user is an admin, if they are, return next()
    if(req.user.isAdmin === 0 || req.user.isAdmin === 1) {
        console.log("ADMIN IS TURE")
        return next()
    }
    // access the traiing session by it's id and update it
    const training = await Training.findById(id);
    // if the req.user._id does NOT equal the author of the training session then flash error
    if(!training.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/training/${id}`)
    }
    // if the user does have permission, then call enxt
    next();
}

// function that validates a fixture, using Joi Schema
module.exports.validateFixture = (req, res, next) => {
    // extract the error portion (if there is one)
    const {error} = fixtureSchema.validate(req.body);
    //  if Joi schema throws an error, throw an Express Erorr to pass on to our error handler route
    if (error) {
        // mapping over 'error' which is an object
        // for each element in the error object, we will join the message of each element and speerate with a comma
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        // if not errors, run next() so it moves on into the route handler
        next()
    }
}

// function that checks that the person trying to edit or delete a training session is the same user that created the session
module.exports.isFixtureAuthor = async(req, res, next) => {
    const {id} = req.params;
    // checks to see if the logged in user is an admin, if they are, return next()
    if(req.user.isAdmin === 0 || req.user.isAdmin === 1) {
        console.log("ADMIN IS TURE")
        return next()
    }
    // access the fixture by it's id and update it
    const fixture = await Fixture.findById(id);
    // if the req.user._id does NOT equal the author of the training session then flash error
    if(!fixture.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/fixture/${id}`)
    }
    // if the user does have permission, then call enxt
    next();
}

// function that validates an event, using Joi Schema
module.exports.validateEvent = (req, res, next) => {
    // extract the error portion (if there is one)
    const {error} = eventSchema.validate(req.body);
    // checks to see if the logged in user is an admin, if they are, return next()
    if(req.user.isAdmin === 0 || req.user.isAdmin === 1) {
        console.log("ADMIN IS TURE")
        return next()
    }
    //  if Joi schema throws an error, throw an Express Erorr to pass on to our error handler route
    if (error) {
        // mapping over 'error' which is an object
        // for each element in the error object, we will join the message of each element and speerate with a comma
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        // if not errors, run next() so it moves on into the route handler
        next()
    }
}

// function that checks that the person trying to edit or delete an event is the same user that created the session
module.exports.isEventAuthor = async(req, res, next) => {
    const {id} = req.params;
    // checks to see if the logged in user is an admin, if they are, return next()
    if(req.user.isAdmin === 0 || req.user.isAdmin === 1) {
        console.log("ADMIN IS TURE")
        return next()
    }
    // access the event by it's id and update it
    const event = await Event.findById(id);
    // if the req.user._id does NOT equal the author of the training session then flash error
    if(!event.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/event/${id}`)
    }
    // if the user does have permission, then call enxt
    next();
}



//function that validates an attendant, using Joi Schema
module.exports.validateAttendant = (req, res, next) => {
    const {error} = attendantSchema.validate(req.body);
    // if Joi schema throws an error, throw and express error to pass on to our error handler route
    if (error) {
        // mapping over 'error' which is an object
        // for each element in the error object, we will join the message of each element and speerate with a comma
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        // if not errors, run next() so it moves on into the route handler
        next()
    }
}

// function to capitalize the first letter of string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}