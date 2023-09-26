// require team model
const Team = require('../../models/team');

// function checks to see if opponent submitted is stored in DB or not
async function isOpponentNew(newFixtureOpponent) {
    const opponents = await Team.distinct('name');
    // console.log(opponents)
    // console.log(newFixtureOpponent)
    if (!opponents.includes(newFixtureOpponent)) {
        // console.log('we have a new challenger!')
        const newTeam = new Team({name: newFixtureOpponent});
        // console.log(newTeam)
        await newTeam.save();
    } else {
        console.log('pre existing opponent')
    }
}

module.exports = {
    isOpponentNew,
}