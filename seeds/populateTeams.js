// if we are not in production mode, require the dotenv module
// process.env.NODE_ENV is an environment variable that is usually development or production
// if we are running in development mode require thedotenv package
// it will hten take the variables we have defined in our .env file and add them int process.env in our node app
// so we can access them in our files
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const mongoose = require('mongoose');
//require the Team model
const Team = require('../models/team') 

// require the array of teams
const teams = require('./teams');

//connect to database
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:/eckc-app'
mongoose.connect(dbUrl);

//error handling for connecting to a database
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const seedTeamsDB = async () => {
    //deletes everything in Team DB
    await Team.deleteMany({});
    for (let team of teams) {
        console.log(team)
        const newTeam = new Team({
            name: team,
        });
        // console.log(newTeam.name)
        await newTeam.save();
    }
}

// execute seedTeamDB
seedTeamsDB().then(() => {
    // close connection to db once seedTeamsDB has executed
    // mongoose.connection.close()
    console.log("Team collection populated");
    mongoose.connection.close()
});