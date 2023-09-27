// if we are not in production mode, require the dotenv module
// process.env.NODE_ENV is an environment variable that is usually development or production
// if we are running in development mode require thedotenv package
// it will hten take the variables we have defined in our .env file and add them int process.env in our node app
// so we can access them in our files
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// requiring express so that we start up a server to listen for requests
const express = require('express');
// requring ejs
const ejsMate = require('ejs-mate');
//requiring catchAsync wrapper function
const catchAsync = require('./utils/catchAsync');
// require ExpressError (our own defined Error class)
const ExpressError = require('./utils/ExpressError');
// requiring path package
const path = require('path');
//reuire mongoose
const mongoose = require('mongoose');

// require method override so that we can make PUT requests for the edit forms to update training/fixture/events and send the updated date to the db
const methodOverride = require('method-override');
// configuring sessions so that we can use req.flash and add authentication
const session = require('express-session');
//require flash
const flash = require('connect-flash');
//require PASSPORT and passport-local strategy
const passport = require('passport');
const LocalStrategy = require('passport-local')
//require User Model
const User = require('./models/user');
//require training router
const attendantRoutes = require('./routes/attendants')
//require training router
const trainingRoutes = require('./routes/trainings');
//require fixture router
const fixtureRoutes = require('./routes/fixtures')
//require event router
const eventRoutes = require('./routes/events')
//require user router
const userRoutes = require('./routes/users')
//require schedule router
const scheduleRoutes = require('./routes/schedules')
//require helmet
const helmet = require('helmet')

//requring connect-mongo
const MongoStore = require('connect-mongo');

//require mongo sanitize package
const mongoSanitize = require('express-mongo-sanitize');

//our Url to access our DB
//dbUrl = process.env.DB_URL
//connect to database
dbUrl = process.env.DB_URL
mongoose.connect(dbUrl);

//error handling for connecting to a database
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

//executing express
const app = express();

// telling express we want to use ejsMate as the ejs engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//telling express to parse the body from a post request
app.use(express.urlencoded({ extended: true }))
//app.use so that we can use method override on forms
// setting the query string as _method
app.use(methodOverride('_method'))

//creating secret as a .env variable
// OR the other secret is a development backup
const secret = process.env.SECRET || 'thisshouldbeabettersecret';

//creating a newMongoDB store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    // touchAfter, you do not want to resave all the session in DB every time a user refreshes the page.
    //instead you can lazy update the session, by limiting a period of time:
    touchAfter: 24 * 60 * 60, //time period in seconds
    crypto: {
        secret,
    }
})

//check for errors for our session store
store.on("error", function(e) {
    console.log("SESSION STORE ERROR", e)
})


// configuring and executing session
const sessionConfig = {
    // passing in our session store into sessionConfig
    store, // it will now using Mongo to store our information
    // naming the session to 'session'
    name: 'session', // give the session cookie a different name to default
    secret,
    resave: false,
    saveUninitialized: true,
    // adding in options for the cookie we send back to the client when a request is made
    cookie: {
        HttpOnly: true, // set HttpOnly to true - if this is included in a cookie, the cookie cannot be accessed by client-side scripts
        //secure: true, // cookies can only be configured over https - commented out for now
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // expires in 7 days time
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}
app.use(session(sessionConfig));

//app.use flash
app.use(flash());

//use helmet - automatically eneables the 11 helmet middleware
app.use(helmet(
    //disabling CSP middleware for now
    //{contentSecurityPolicy: false}
))

// adding in our own configuration for contentSecurityPolicy
// sources and scripts we want to allow
const scriptSrcUrls = [
    "https://maps.googleapis.com/",
    "https://cdn.jsdelivr.net/"


];
const styleSrcUrls = ["https://cdn.jsdelivr.net/"];
const connectSrcUrls = [
    "maps.googleapis.com"
];
const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", 'nonce-rAnd0m', ...scriptSrcUrls],
            //to allow inline event handlers. Not the secure way to do it. 
            //Could add 'nonce-' instead - would need to do for each inline event handler in the app.
            //See docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src
            scriptSrcAttr: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
            mediaSrc: [],
            childSrc: ["blob:"]
        }
    })
);



//PASSPORT
//app.use passport.initialize and passport.session
//to initialize Passport
app.use(passport.initialize());
//to add PERSISTENT LOGIN SESSIONS
// NOTE: passport.session() MUST BE CALLED AFTER REQULAR SESSION APP.USE
app.use(passport.session());
//passpport needs to use the LocalStrategy we have requried with the authentication method called authenticated that should be located on our User model
// authenticate method is added automatically by passport-local-mongoose package (in the user model)
passport.use(new LocalStrategy(User.authenticate()))
// tells passport how to SERIALIZE a user - how to store user in the session
passport.serializeUser(User.serializeUser())
// tells passport how to DESERIALIZE a user - how to get a user out of the session
passport.deserializeUser(User.deserializeUser())


//flash middleware - if there's anything in req.flash in that session, we will have access to it as a local variable in the res.redirect route/location
// so ON EVERY SINGLE REQUEST, we will have access to 'success' flash in res.locals
// **** ALSO ACCESSES REQ.USER (and store it in res.locals.currentUser) FOR EVERY REQUEST SO THAT WE HAVE ACCESS TO USER INFO (req.user is coming from the session, thanks to passport)
// **** We can then hide log in or logout depending on whether someone is loggedin or not
app.use((req, res, next) => {
    // if '/login' or '/' is NOT in the orignalUrl on the request
    // https://www.youtube.com/watch?v=g7SaXCYCgXU
    if(!['/login', '/'].includes(req.originalUrl)) {
        // return to the originalUrl where the request came from
        // store the req.originalUrl in the session as returnTo - this will be the URL that the user will be redirected to after logging in
        req.session.returnTo = req.originalUrl
    }
    // set res.locals.success to be whatever 'success' flash is, if there is one
    res.locals.success = req.flash('success');
    // set res.locals.success to be whatever 'error' flash is, if there is one
    res.locals.error = req.flash('error');
    //set res.locals.currentUser to be req.user
    res.locals.currentUser = req.user;
    next();
})

//setting our port number to be whatever is set in .env file OR it will be 3000
const port = process.env.PORT || 3000

// trainings router
app.use('/training', trainingRoutes)
// fixtures router
app.use('/fixture', fixtureRoutes)
// event router
app.use('/event', eventRoutes)
// attendant router
app.use('/', attendantRoutes)
//user router
app.use('/', userRoutes)
//schedule router
app.use('/schedule', scheduleRoutes)

//app.use to set express static assets to be the public folder in our project folder
app.use(express.static(path.join(__dirname, 'public')))

//app.use mongoSanitize - will now remove completely remove keys and associated data from the object if they start with a $ or contain a .
app.use(mongoSanitize())


//get request for home route
app.get('/', catchAsync(async (req, res) => {
    res.render('home')
}))

// *** OUR ERROR HANDLER ***
// app.all will work for EVERY SINGLE REQUEST
// will only run if none of the routes aabove are matched
app.all('*', (req, res, next) => {
    console.log('app.all handler')
    // pass a new ExpressError that takes an error message and statusCode as it's arguments
    // this is then passed to next to be caught by our error handler below
    next(new ExpressError('Page Not Found', 404))
})

// **** BASIC ERROR HANDLER *****
app.use((err, req, res, next) => {
    // console.log(err.statusCode, err.message)
    // getting the statusCode and message from err
    // if there is NOT a value for statusCode or message in err, then set the code to 500 and the message to "Something went wrong"
    const {statusCode = 500} = err;
    if (!err.message) err.message = "Something Went Wrong!"
    // set the status code to = statusCode and redner error.ejs
    res.status(statusCode).render('error', {err})
})

// setting up our express server to listen for requests on port
app.listen(port, () => {
    console.log(`Serving On Port ${port}`)
})