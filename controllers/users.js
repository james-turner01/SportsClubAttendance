const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async(req, res) => {
    // adding a try-catch so that if a username or email has already been used, tell the user
    try {
        // destructure req.body to get email, username and password
        const {email, username, password} = req.body;
        const user = new User({email, username, password});
        // checking if user has entered the adminCOde when registering
        if (req.body.adminCode === process.env.ADMINCODELEVELZERO) {
            console.log('SUPER ADMIN')
            user.isAdmin = 0;
        }
        if (req.body.adminCode === process.env.ADMINCODELEVELONE) {
            console.log('SUB ADMIN')
            user.isAdmin = 1;
        }
        // using register method from  passport-local-mongoose to pass in the user data and the password
        // this will then salt and hash the password - it wil then store the salt and hashed password on the new user
        const registeredUser = await User.register(user, password);
        // using passport method req.logIn, to log in a registered user
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Registration Successful!');
            res.redirect('/schedule');
    })
    } catch(e) {
        // error code in Mongoose for duplicate email
        if(e.code === 11000){
            req.flash('error', "'" + e.keyValue.email + "'" + " is used by another account. Use a different email address.")
        } else {
            req.flash('error', e.message)
        }
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req, res)=> {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    // if you make it into the route handler then that means passport.authenticate was successful
    req.flash('success', 'Welcome back!');
    // check to see if there is a url stored in res.locals.returnTo, if there is save it to redirectUrl
    // if there is not set redirectUrl to '/campgrounds'
    const redirectUrl = res.locals.returnTo || '/schedule';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    // logout method added by passport to req
    // logout() required a callback funciton as an argument to handle any errors
    console.log(req.isAuthenticated())
    const loggedInCheck = req.isAuthenticated()
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        // if someone was logged in before req.logout and req.logout has worked, display success flash
        if (loggedInCheck) {
            req.flash('success', 'Logged Out');
        }
        res.redirect('/schedule');
    });
}