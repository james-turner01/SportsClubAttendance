const mongoose = require('mongoose');
//require the Team model
const Team = require('../models/team') 

// require the array of teams
const teams = require('./teams');

//connect to database
// 'mongodb://127.0.0.1:/yelp-camp'
mongoose.connect('mongodb://127.0.0.1:/eckc-app');

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