// used broweserify so that require keyword can be used in pagination stuff below (see line 42 below)
// references : https://medium.com/swlh/browersify-use-require-in-client-side-javascript-7414b229a4ad & https://browserify.org/
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Converting time string "xx:xx" into DateTimeformat on the training date
function timeToDatetime(trainingDate, timeString) {
    return new Date(new Date(trainingDate).setHours(timeString.split(":")[0], timeString.split(":")[1], 0, 0));
}

// This function gets the Date of the next day by taking the date of the training session, converting it to milliseconds, adding 1 day (in milliseconds, then converting to a date string)
function nextDayDateFunc(trainingDate) {
    return new Date(new Date(trainingDate).getTime() +
        24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric", month: "long", day: "numeric"
        });
}

// function that gets the meet time bydoing training time - meet time
function meetTimeToDate(trainingDate, startTime, meetTime) {
    return new Date(new Date(trainingDate).setHours(startTime.split(":")[0], startTime.split(":")[1], 0, 0) - (meetTime * 60 * 1000))
}

//function takes date object and returns the time portion only
function dateToTimeOnly(date) {
    return date.toTimeString().slice(0, 5)
}

//function takes a date object and displayes it in the format 'Weekday, day number Month Year' e.g. 'Friday, 5 May 2023'
function dateToLocaleDateString(date) {
    return new Date(date.getTime()).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
}

module.exports = {
    timeToDatetime,
    nextDayDateFunc,
    meetTimeToDate,
    dateToTimeOnly,
    dateToLocaleDateString,
}
},{}],2:[function(require,module,exports){
// require the functions from helper.js
const {timeToDatetime, nextDayDateFunc, meetTimeToDate, dateToTimeOnly, dateToLocaleDateString} = require('../javascripts/helper.js')
// get the View More anchor element
const paginate = document.getElementById('paginate');
//get the activiteis container element
const activitiesContainer = document.getElementById("activities-container");

// if there is an anchor element with the id='paginate' run the event listener below
if (paginate) {
    //add event listener for when the View more anchor is clicked
    paginate.addEventListener('click', function(event) {
        // stop the click event from trying to send the query string request (/schedule?page=...)
        event.preventDefault();
        // instead we will send our OWN REQUEST using Ftch API as it is a native API
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
        // using the fetch method to get the data from this.href = the href when the button is clicked e.g. /schedule?page=2
        fetch(this.href)
            // takes the response from the fetch methd
            //response. json() method parses the JSON data as a JavaScript object
            .then(response => response.json())
            .then(data => {
                // for each activity in data.docs
                for (const activity of data.docs) {
                    // pass the activity data into the function generateActivity (see below)
                    // pass the activity data into the function generateActivity (see below)
                    const template = generateActivity(activity)
                    // console.log("template", template)
                    activitiesContainer.insertAdjacentHTML("beforeend", template)
                }
                // set nextPage = date.nextPage
            const {nextPage} = data;
                //change the anchor href (view more) so that the query is ?page=${nextPage} so that next the button can be clicked again to load the enxt 10 activites
                if(data.page < data.totalPages)  {
                    this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
                } else {
                    // hide the view more button
                    paginate.style.display = 'none';
                }
                
            })
    })
}

function generateActivity(activity) {
    //`<h1>${activity.date}</h1>`
    if(activity.activity_model === "Training") {
        // calculating variables needed for logic later on
        // will give date of the next day if endTime is before startTime
        // creates variables for start time and end Time in Datetime format
        const startTimeAsDate=timeToDatetime(activity.activity_data.date, activity.activity_data.startTime); 
        const endTimeAsDate=timeToDatetime(activity.activity_data.date, activity.activity_data.endTime);
        const partOne = (() => {
            const templatePartOne = `            
            <div class="card mb-3">
            <div class="card-body mb-0">
            <h4 class="card-title">${ activity.activity_model } @ ${ activity.activity_data.location }</h4>
            <h6 class="card-subtitle mb-2 text-muted">
                ${ dateToLocaleDateString(new Date(activity.activity_data.date))}
            </h6>
            `
            return templatePartOne;
        })();
        // console.log(partOne)

        const partTwo = (() => {
            // if there is a meetTime, calculate meetTime as a date and get the meetTime only as well
            if (activity.activity_data.meetTime !==0 ) {
                const meetTimeAsDate=meetTimeToDate(activity.activity_data.date, activity.activity_data.startTime, activity.activity_data.meetTime);
                const meetTimeOnly=dateToTimeOnly(meetTimeAsDate);
                
                // will display the full date of the day before if the meetTime is greater than the start time
                // (in this instance it is assumed the meet time is the day before)
                if(meetTimeOnly> activity.activity_data.startTime) {
                    // const meetTimeDayBeforeDate = dateToLocaleDateString(meetTimeAsDate);

                    const templatePartTwo = `
                        <p class="card-text">
                        <strong>Meet Time:</strong>
                        ${meetTimeOnly} (${ dateToLocaleDateString(meetTimeAsDate)})
                        </p>
                    `
                    return templatePartTwo
                }
            
                const templatePartTwo = `
                    <p class="card-text">
                    <strong>Meet Time:</strong>
                    ${meetTimeOnly}
                    </p>
                `
                return templatePartTwo
            }
            return ``
        })();
        // console.log(partTwo)

        const partThree = `
        <p class="card-text">
            <strong>Start Time:</strong>
            ${ activity.activity_data.startTime }
        </p>
        `
        const partFour = (() => {
        // will give date of the next day if endTime is before startTime
        //gets the date for the next Day
        if (startTimeAsDate> endTimeAsDate) {
            const nextDayDate=nextDayDateFunc(activity.activity_data.date);
            
            const templatePartFour = `
            <p class="card-text">
                <strong>End Time:</strong>
                ${activity.activity_data.endTime}
                (${nextDayDate})
            </p>
            `
            return templatePartFour
        }
        return `
        <p class="card-text mb-0">
            <strong>End Time:</strong>
                ${activity.activity_data.endTime}
        </p>
        `
    })();
    // console.log(partFour)
    const partFive = `
                <a href="/${activity.activity_model.toLowerCase()}/${activity.activity_data._id}" class="stretched-link"></a>
            </div>
        </div>
    `;
    const trainingTemplate = partOne + partTwo + partThree + partFour + partFive;
    return trainingTemplate;
    } else if (activity.activity_model === "Fixture") {
        // console.log("CREATING A FIXTURE TEMPLATE")
        // calculating variables needed for logic later on
        // will give date of the next day if endTime is before startTime
        // creates variables for start time and end Time in Datetime format
        const startTimeAsDate=timeToDatetime(activity.activity_data.date, activity.activity_data.startTime); 
        const endTimeAsDate=timeToDatetime(activity.activity_data.date, activity.activity_data.endTime);
        const partOne = (() => {
            const templatePartOne = `
            <div class="card mb-3">
                <div class="card-body">
                    <h4 class="card-title">${activity.activity_data.team} ${activity.activity_data.venue} vs ${activity.activity_data.opponent} @ ${activity.activity_data.location}</h4>
                    <h6 class="card-subtitle mb-2 text-muted">
                        ${ dateToLocaleDateString(new Date(activity.activity_data.date))}
                    </h6>
            `
            return templatePartOne;
        })();
        // console.log(partOne)

        const partTwo = (() => {
            // if there is a meetTime, calculate meetTime as a date and get the meetTime only as well
            if (activity.activity_data.meetTime !==0 ) {
                const meetTimeAsDate=meetTimeToDate(activity.activity_data.date, activity.activity_data.startTime, activity.activity_data.meetTime);
                const meetTimeOnly=dateToTimeOnly(meetTimeAsDate);
                
                // will display the full date of the day before if the meetTime is greater than the start time
                // (in this instance it is assumed the meet time is the day before)
                if(meetTimeOnly> activity.activity_data.startTime) {
                    const templatePartTwo = `
                        <p class="card-text">
                        <strong>Meet Time:</strong>
                        ${meetTimeOnly} (${ dateToLocaleDateString(meetTimeAsDate)})
                        </p>
                    `
                    return templatePartTwo
                }
            
                const templatePartTwo = `
                    <p class="card-text">
                    <strong>Meet Time:</strong>
                    ${meetTimeOnly}
                    </p>
                `
                return templatePartTwo
            }
            return ``
        })();
        // console.log(partTwo)

        const partThree = `
        <p class="card-text">
            <strong>Start Time:</strong>
            ${ activity.activity_data.startTime }
        </p>
        `
        const partFour = (() => {
            // will give date of the next day if endTime is before startTime
            //gets the date for the next Day -->
            if (startTimeAsDate> endTimeAsDate) {
                const nextDayDate=nextDayDateFunc(activity.activity_data.date);
                
                const templatePartFour = `
                <p class="card-text">
                    <strong>End Time:</strong>
                    ${activity.activity_data.endTime}
                    (${nextDayDate})
                </p>
                `
                return templatePartFour
            }
            return `
            <p class="card-text mb-0">
                <strong>End Time:</strong>
                    ${activity.activity_data.endTime}
            </p>
            `
        })();
        // console.log(partFour)

        const partFive = `
                    <a href="/${activity.activity_model.toLowerCase()}/${activity.activity_data._id}" class="stretched-link"></a>
                </div>
            </div>
        `;
        const fixtureTemplate = partOne + partTwo + partThree + partFour + partFive;
        return fixtureTemplate;
    } else if (activity.activity_model === "Event") {
        // calculating variables needed for logic later on
        // will give date of the next day if endTime is before startTime
        // creates variables for start time and end Time in Datetime format
        const startTimeAsDate=timeToDatetime(activity.activity_data.date, activity.activity_data.startTime); 
        const endTimeAsDate=timeToDatetime(activity.activity_data.endDate, activity.activity_data.endTime);
        const partOne = (() => {
            if (dateToLocaleDateString(new Date(activity.activity_data.date)) === dateToLocaleDateString(new Date(activity.activity_data.endDate))) {
                const templatePartOne = `            
                <div class="card mb-3">
                    <div class="card-body mb-0">
                    <h4 class="card-title">${ activity.activity_data.title } @ ${ activity.activity_data.location }</h4>
                    <h6 class="card-subtitle mb-2 text-muted">
                        ${ dateToLocaleDateString(new Date(activity.activity_data.date))}
                    </h6>
                `
                return templatePartOne;
            }
            const templatePartOne = `            
                <div class="card mb-3">
                    <div class="card-body mb-0">
                    <h4 class="card-title">${ activity.activity_data.title } @ ${ activity.activity_data.location }</h4>
                    <h6 class="card-subtitle mb-2 text-muted">
                        ${ dateToLocaleDateString(new Date(activity.activity_data.date))} to ${ dateToLocaleDateString(new Date(activity.activity_data.endDate))}
                    </h6>
                `
                return templatePartOne;
        })();
        // console.log(partOne)
        const partTwo = (() => {
            // if there is a meetTime, calculate meetTime as a date and get the meetTime only as well
            if (activity.activity_data.meetTime !==0 ) {
                const meetTimeAsDate=meetTimeToDate(activity.activity_data.date, activity.activity_data.startTime, activity.activity_data.meetTime);
                const meetTimeOnly=dateToTimeOnly(meetTimeAsDate);
                // will display the full date of the day before if the meetTime is greater than the start time
                // (in this instance it is assumed the meet time is the day before)
                if(meetTimeOnly> activity.activity_data.startTime) {
                    const templatePartTwo = `
                        <p class="card-text">
                        <strong>Meet Time:</strong>
                        ${meetTimeOnly} (${ dateToLocaleDateString(meetTimeAsDate)})
                        </p>
                    `
                    return templatePartTwo
                } else {
                    const templatePartTwo = `
                        <p class="card-text">
                        <strong>Meet Time:</strong>
                        ${meetTimeOnly} on ${ dateToLocaleDateString(new Date(activity.activity_data.date)) }
                        </p>
                    `
                    return templatePartTwo
                }
            
                const templatePartTwo = `
                    <p class="card-text">
                    <strong>Meet Time:</strong>
                    ${meetTimeOnly}
                    </p>
                `
                return templatePartTwo
            }
            return ``
        })();
        // console.log(partTwo)

        const partThree = `
        <p class="card-text">
            <strong>Start Time:</strong>
            ${ activity.activity_data.startTime } on ${dateToLocaleDateString(new Date(activity.activity_data.date))}
        </p>
        `
        const partFour = (() => {

            const templatePartFour = `
            <p class="card-text">
                <strong>End Time:</strong>
                ${activity.activity_data.endTime} on ${dateToLocaleDateString(new Date(activity.activity_data.endDate))}
            </p>
            `
            return templatePartFour
    })();
    // console.log(partFour)
    const partFive = `
                <a href="/${activity.activity_model.toLowerCase()}/${activity.activity_data._id}" class="stretched-link"></a>
            </div>
        </div>
    `;
    const eventTemplate = partOne + partTwo + partThree + partFour + partFive;
    // console.log(eventTemplate)
    return eventTemplate;        
    }
    
}

},{"../javascripts/helper.js":1}]},{},[2]);
