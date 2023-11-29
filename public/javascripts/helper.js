// Converting time string "xx:xx" into DateTimeformat on the training date
function timeToDatetime(trainingDate, timeString) {
    return new Date(new Date(trainingDate).setHours(timeString.split(":")[0], timeString.split(":")[1], 0, 0));
}
// This function gets the Date of the next day by taking the date of the training session, converting it to milliseconds, adding 1 day (in milliseconds, then converting to a date string)
function nextDayDate(trainingDate) {
    return new Date(new Date(trainingDate).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric"});
}
// function that gets the meet time by doing training time - meet time
function meetTimeToDate(trainingDate, startTime, meetTime) {
    return new Date(new Date(trainingDate).setHours(startTime.split(":")[0], startTime.split(":")[1], 0, 0) - (meetTime * 60 * 1000))
}
//function takes date object and returns the time portion only
function dateToTimeOnly(date) { return date.toTimeString().slice(0, 5) }
//function takes a date object and displayes it in the format 'Weekday, day number Month Year' e.g. 'Friday, 5 May 2023'
function dateToLocaleDateString(date) {
    return new Date(date.getTime()).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
}
// REPEAT DATES FUNCTION - gets dates in between start and end dates in an array: [startDate, ...., endDate]. Is for createTraining POST route
function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime()); 
    const dates = [];
    while (date <= endDate) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 7);
    }
    return dates;
}
module.exports = {timeToDatetime, nextDayDate, meetTimeToDate, dateToTimeOnly, dateToLocaleDateString, getDatesInRange}
