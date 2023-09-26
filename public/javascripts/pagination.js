// **** DO NOT EDIT THIS DOC, IF YOU WANT TO MAKE CHANGES, PLEASE CHANGE bundle.js ****
// *******************************************************************************************
// We are using browserify node package, that takes the require on line 5 and the rest of the code below, and bundles it into one file called bundle.js
//  this means that require can be used on the client side, meaning helper.js can be used for 'paginate.js'
// ********************************************************************************************

const {timeToDatetime, meetTimeToDate, dateToTimeOnly, dateToLocaleDateString} = require('../javascripts/helper.js')
// get the View More anchor element
const paginate = document.getElementById('paginate');
console.log(paginate)
//get the activiteis container element
const activitiesContainer = document.getElementById("activities-container");
console.log(activitiesContainer)
//add event listener for when the View more anchor is clicked
paginate.addEventListener('click', function(event) {
    console.log("href", this.href)
    console.log("click happened")
    // stop the click event from trying to send the query string request (/schedule?page=...)
    event.preventDefault();
    // instead we will send our OWN REQUEST using Ftch API as it is a native API
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    // using the fetch method to get the data from this.hreg = the href when the button is clicked e.g. /schedule?page=2
    fetch(this.href)
        // takes the response from the fetch methd
        //response. json() method parses the JSON data as a JavaScript object
        .then(response => response.json())
        .then(data => {
            console.log("DOCS", data)
            // for each activity in data.docs
            for (const activity of data.docs) {
                // pass the activity data into the function generateActivity (see below)
                // pass the activity data into the function generateActivity (see below)
                const template = generateActivity(activity)
                console.log("template", template)
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

function generateActivity(activity) {
    //`<h1>${activity.date}</h1>`
    if(activity.activity_model === "Training") {
        // calculating variables needed for logic later on
        // <!-- will give date of the next day if endTime is before startTime -->
        // <!-- creates variables for start time and end Time in Datetime format -->
        const startTimeAsDate=timeToDatetime(activity.activity_data.date, activity.activity_data.startTime); 
        const endTimeAsDate=timeToDatetime(activity.activity_data.date, activity.activity_data.endTime);
        const partOne = (() => {
            const templatePartOne = `            
            <div class="card mb-3">
            <div class="card-body mb-0">
            <h4 class="card-title">${ activity.activity_model } @ ${ activity.activity_data.location }</h4>
            <h6 class="card-subtitle mb-2 text-muted">
                ${ dateToLocaleDateString(activity.activity_data.date)}
            </h6>
            `
            return templatePartOne;
        })();
        console.log(partOne)
        const partTwo = (() => {
            // if there is a meetTime, calculate meetTime as a date and get the meetTime only as well
            if (activity.activity_data.meetTime !==0 ) {
                const meetTimeAsDate=meetTimeToDate(activity.activity_data.date, activity.activity_data.startTime, activity.activity_data.meetTime);
                const meetTimeOnly=dateToTimeOnly(meetTimeAsDate);
                
                // will display the full date of the day before if the meetTime is greater than the start time
                // (in this instance it is assumed the meet time is the day before)
                if(meetTimeOnly> activity.activity_data.startTime) {
                    const meetTimeDayBeforeDate = dateToLocaleDateString(meetTimeAsDate);

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
        console.log(partTwo)

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
            const nextDayDate=nextDayDate(activity.activity_data.date);
            
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
    console.log(partFour)
    const partFive = `
                <a href="/${activity.activity_model.toLowerCase()}/${activity.activity_data._id}" class="stretched-link"></a>
            </div>
        </div>
    `;
    const trainingTemplate = partOne + partTwo + partThree + partFour + partFive;
    console.log(trainingTemplate)
    return trainingTemplate;
    } else if (activity.activity_model === "Fixture") {
        console.log("CREATING A FIXTURE TEMPLATE")
        // calculating variables needed for logic later on
        // <!-- will give date of the next day if endTime is before startTime -->
        // <!-- creates variables for start time and end Time in Datetime format -->
        const startTimeAsDate=timeToDatetime(activity.activity_data.date, activity.activity_data.startTime); 
        const endTimeAsDate=timeToDatetime(activity.activity_data.date, activity.activity_data.endTime);
        const partOne = (() => {
            const templatePartOne = `
            <div class="card mb-3">
                <div class="card-body">
                    <h4 class="card-title">${activity.activity_data.team} ${activity.activity_data.venue} vs ${activity.activity_data.opponent} @ ${activity.activity_data.location}</h4>
                    <h6 class="card-subtitle mb-2 text-muted">
                        ${ dateToLocaleDateString(activity.activity_data.date)}
                    </h6>
            `
            return templatePartOne;
        })();
        console.log(partOne)

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
        console.log(partTwo)

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
                const nextDayDate=nextDayDate(activity.activity_data.date);
                
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
        console.log(partFour)
        const partFive = `
                    <a href="/${activity.activity_model.toLowerCase()}/${activity.activity_data._id}" class="stretched-link"></a>
                </div>
            </div>
        `;
        const fixtureTemplate = partOne + partTwo + partThree + partFour + partFive;
        console.log(fixtureTemplate)
        return fixtureTemplate;
    } else if (activity.activity_model === "Event") {
        // calculating variables needed for logic later on
        // <!-- will give date of the next day if endTime is before startTime -->
        // <!-- creates variables for start time and end Time in Datetime format -->
        const startTimeAsDate=timeToDatetime(activity.activity_data.date, activity.activity_data.startTime); 
        const endTimeAsDate=timeToDatetime(activity.activity_data.endDate, activity.activity_data.endTime);
        const partOne = (() => {
            if (dateToLocaleDateString(activity.activity_data.date) === dateToLocaleDateString(activity.activity_data.endDate)) {
                const templatePartOne = `            
                <div class="card mb-3">
                    <div class="card-body mb-0">
                    <h4 class="card-title">${ activity.activity_data.title } @ ${ activity.activity_data.location }</h4>
                    <h6 class="card-subtitle mb-2 text-muted">
                        ${ dateToLocaleDateString(activity.activity_data.date)}
                    </h6>
                `
                return templatePartOne;
            }
            const templatePartOne = `            
                <div class="card mb-3">
                    <div class="card-body mb-0">
                    <h4 class="card-title">${ activity.activity_data.title } @ ${ activity.activity_data.location }</h4>
                    <h6 class="card-subtitle mb-2 text-muted">
                        ${ dateToLocaleDateString(activity.activity_data.date)} to ${ dateToLocaleDateString(activity.activity_data.endDate)}
                    </h6>
                `
                return templatePartOne;
        })();
        console.log(partOne)
        const partTwo = (() => {
            // if there is a meetTime, calculate meetTime as a date and get the meetTime only as well
            if (activity.activity_data.meetTime !==0 ) {
                const meetTimeAsDate=meetTimeToDate(activity.activity_data.date, activity.activity_data.startTime, activity.activity_data.meetTime);
                const meetTimeOnly=dateToTimeOnly(meetTimeAsDate);
                // <% if (meetTimeOnly> activity.activity_data.startTime) { %>
                //     (<%= helper.dateToLocaleDateString(meetTimeAsDate)%>)
                //     <% } else { %>
                //     on <%= activity.activity_data.date.toLocaleDateString("en-GB", {year:"numeric", month:"long", day:"numeric"}) %>
                //     <% } %>
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
                        ${meetTimeOnly} on ${ dateToLocaleDateString(activity.activity_data.date) }
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
        console.log(partTwo)

        const partThree = `
        <p class="card-text">
            <strong>Start Time:</strong>
            ${ activity.activity_data.startTime } on ${dateToLocaleDateString(activity.activity_data.date)}
        </p>
        `
        const partFour = (() => {

            const templatePartFour = `
            <p class="card-text">
                <strong>End Time:</strong>
                ${activity.activity_data.endTime} on ${dateToLocaleDateString(activity.activity_data.endDate)}
            </p>
            `
            return templatePartFour
    })();
    console.log(partFour)
    const partFive = `
                <a href="/${activity.activity_model.toLowerCase()}/${activity.activity_data._id}" class="stretched-link"></a>
            </div>
        </div>
    `;
    const eventTemplate = partOne + partTwo + partThree + partFour + partFive;
    console.log(eventTemplate)
    return eventTemplate;        
    }
    
}

        


        

// const template = `<div>

// <% if(activity.activity_model === "Training") {%>
// <a href="/<%= activity.activity_model.toLowerCase() %>/<%= activity.activity_data._id %>" class="card-link">
//   <div class="card mb-3">
//     <div class="card-body">
//       <h4 class="card-title"><%= activity.activity_model %> @ <%=activity.activity_data.location %></h4>
//       <h6 class="card-subtitle mb-2 text-muted">
//         <%= activity.activity_data.date.toLocaleDateString("en-GB", {weekday: "long" ,
//               year:"numeric", month:"long", day:"numeric"})%>
//       </h6>
//       <% if(activity.activity_data.meetTime !==0 ) {%>
//       <p class="card-text">
//         <strong>Meet Time:</strong>
//         <!-- gets meet time as in date format -->
//         <!-- AND gets meet time as the TIME ONLY -->
//         <% const meetTimeAsDate=helper.meetTimeToDate(activity.activity_data.date, activity.activity_data.startTime, activity.activity_data.meetTime);
//             const meetTimeOnly=helper.dateToTimeOnly(meetTimeAsDate); 
//         %>

//         <%=meetTimeOnly %>
//         <!-- will display the full date of the day before if the meetTime is greater than the start time -->
//         <!-- (in this instance it is assumed the meet time is the day before) -->
//         <% if(meetTimeOnly> activity.activity_data.startTime) {%>
//         (<%= helper.dateToLocaleDateString(meetTimeAsDate)%>)
//         <%} %>
//         <% } %>
//       </p>
//       <p class="card-text">
//         <strong>Start Time:</strong>
//         <%= activity.activity_data.startTime %>
//       </p>
//       <p class="card-text">
//         <strong>End Time:</strong>
//         <%= activity.activity_data.endTime %>
//         <!-- will give date of the next day if endTime is before startTime -->
//         <!-- creates variables for start time and end Time in Datetime format -->
//         <% const startTimeAsDate=helper.timeToDatetime(activity.activity_data.date, activity.activity_data.startTime); 
//               const endTimeAsDate=helper.timeToDatetime(activity.activity_data.date, activity.activity_data.endTime); %>
//         <!-- gets the date for the next Day -->
//         <%if (startTimeAsDate> endTimeAsDate) {%>
//         <% const nextDayDate=helper.nextDayDate(activity.activity_data.date); %>
//         (<%=nextDayDate%>)
//         <% } %>
//       </p>
//     </div>
//   </div>
// </a>
// <% } else if (activity.activity_model === "Fixture") {%>
// <a href="/<%= activity.activity_model.toLowerCase() %>/<%= activity.activity_data._id %>" class="card-link">
//   <div class="card mb-3">
//     <div class="card-body">
//       <h4 class="card-title"><%= activity.activity_data.team %> <%= activity.activity_data.venue %> vs <%= activity.activity_data.opponent %> @ <%=activity.activity_data.location %></h4>
//       <h6 class="card-subtitle mb-2 text-muted">
//         <%= activity.activity_data.date.toLocaleDateString("en-GB", {weekday: "long" ,
//                 year:"numeric", month:"long", day:"numeric"})%>
//       </h6>
//       <% if(activity.activity_data.meetTime !==0 ) {%>
//       <p class="card-text">
//         <strong>Meet Time:</strong>
//         <!-- gets meet time as in date format -->
//         <!-- AND gets meet time as the TIME ONLY -->
//         <% const meetTimeAsDate=helper.meetTimeToDate(activity.activity_data.date,
//           activity.activity_data.startTime, activity.activity_data.meetTime);
//           const meetTimeOnly=helper.dateToTimeOnly(meetTimeAsDate);
//           %>

//         <%=meetTimeOnly %>

//         <% if(meetTimeOnly> activity.activity_data.startTime) {%>
//         (<%= helper.dateToLocaleDateString(meetTimeAsDate)%>)
//         <%} %>
//       </p>
//       <% } %>
//       <p class="card-text">
//         <strong>Start Time:</strong>
//         <%= activity.activity_data.startTime %>
//       </p>
//       <p class="card-text">
//         <strong>End Time:</strong>
//         <%= activity.activity_data.endTime %>
//         <!-- will give date of the next day if endTime is before startTime -->
//         <!-- creates variables for start time and end Time in Datetime format -->
//         <% const startTimeAsDate=helper.timeToDatetime(activity.activity_data.date,
//                 activity.activity_data.startTime); const
//                 endTimeAsDate=helper.timeToDatetime(activity.activity_data.date,
//                 activity.activity_data.endTime); %>
//         <!-- gets the date for the next Day -->
//         <%if (startTimeAsDate> endTimeAsDate) {%>
//         <% const nextDayDate=helper.nextDayDate(activity.activity_data.date); %>
//         (<%=nextDayDate%>)
//         <% } %>
//       </p>

//     </div>
//   </div>
// </a>
// <% } else if (activity.activity_model === "Event") {%>
// <a href="/<%= activity.activity_model.toLowerCase() %>/<%= activity.activity_data._id %>" class="card-link">
//   <div class="card mb-3">
//     <div class="card-body">
//       <h4 class="card-title"><%= activity.activity_data.title %> @ <%=activity.activity_data.location %></h4>
//       <h6 class="card-subtitle mb-2 text-muted">
//         <%= activity.activity_data.date.toLocaleDateString("en-GB", {weekday: "long" ,
//                 year:"numeric", month:"long", day:"numeric"})%>
//         <% if (activity.activity_data.date.toLocaleDateString("en-GB", {weekday: "long" , year:"numeric", month:"long", day:"numeric"}) !== activity.activity_data.endDate.toLocaleDateString("en-GB", {weekday: "long" , year:"numeric", month:"long", day:"numeric"})) { %>
//         to <%= activity.activity_data.endDate.toLocaleDateString("en-GB", {weekday: "long" ,
//                   year:"numeric", month:"long", day:"numeric"})%>
//         <% } %>

//       </h6>
//       <% if(activity.activity_data.meetTime !==0 ) {%>
//       <p class="card-text">
//         <strong>Meet Time:</strong>
//         <!-- gets meet time as in date format -->
//         <!-- AND gets meet time as the TIME ONLY -->
//         <% const meetTimeAsDate=helper.meetTimeToDate(activity.activity_data.date,
//           activity.activity_data.startTime, activity.activity_data.meetTime);
//           const meetTimeOnly=helper.dateToTimeOnly(meetTimeAsDate);
//           %>

//         <%=meetTimeOnly %>

//         <% if (meetTimeOnly> activity.activity_data.startTime) { %>
//         (<%= helper.dateToLocaleDateString(meetTimeAsDate)%>)
//         <% } else { %>
//         on <%= activity.activity_data.date.toLocaleDateString("en-GB", {year:"numeric", month:"long", day:"numeric"}) %>
//         <% } %>
//       </p>
//       <% } %>
//       <p class="card-text">
//         <strong>Start Time:</strong>
//         <%= activity.activity_data.startTime %> on <%= activity.activity_data.date.toLocaleDateString("en-GB", {year:"numeric", month:"long", day:"numeric"}) %>
//       </p>

//       <p class="card-text">
//         <strong>End Time:</strong>
//         <%= activity.activity_data.endTime %> on <%= activity.activity_data.endDate.toLocaleDateString("en-GB", {year:"numeric", month:"long", day:"numeric"}) %>
//       </p>
//       <!-- <a href="/" class="stretched-link my-link"></a> -->
//     </div>
//   </div>
// </a>
// <% } %>
// <div class="text-center mb-3">
//   <a href="/schedule?page=<%= activities.nextPage %>" class="btn btn-primary">View More</a>
// </div>
// </div>`;


// const templateAGAIN = `<div>

// <% if(activity.activity_model === "Training") {%>
// <a href="/<%= activity.activity_model.toLowerCase() %>/<%= activity.activity_data._id %>" class="card-link">
//   <div class="card mb-3">
//     <div class="card-body">
//       <h4 class="card-title"><%= activity.activity_model %> @ <%=activity.activity_data.location %></h4>
//       <h6 class="card-subtitle mb-2 text-muted">
//         <%= activity.activity_data.date.toLocaleDateString("en-GB", {weekday: "long" ,
//               year:"numeric", month:"long", day:"numeric"})%>
//       </h6>
//       <% if(activity.activity_data.meetTime !==0 ) {%>
//       <p class="card-text">
//         <strong>Meet Time:</strong>
//         <!-- gets meet time as in date format -->
//         <!-- AND gets meet time as the TIME ONLY -->
//         <% const meetTimeAsDate=helper.meetTimeToDate(activity.activity_data.date,
//                 activity.activity_data.startTime, activity.activity_data.meetTime);
//                 const meetTimeOnly=helper.dateToTimeOnly(meetTimeAsDate);
//                 %>

//         <%=meetTimeOnly %>
//         <!-- will display the full date of the day before if the meetTime is greater than the start time -->
//         <!-- (in this instance it is assumed the meet time is the day before) -->
//         <% if(meetTimeOnly> activity.activity_data.startTime) {%>
//         (<%= helper.dateToLocaleDateString(meetTimeAsDate)%>)
//         <%} %>
//         <% } %>
//       </p>
//       <p class="card-text">
//         <strong>Start Time:</strong>
//         <%= activity.activity_data.startTime %>
//       </p>
//       <p class="card-text">
//         <strong>End Time:</strong>
//         <%= activity.activity_data.endTime %>
//         <!-- will give date of the next day if endTime is before startTime -->
//         <!-- creates variables for start time and end Time in Datetime format -->
//         <% const startTimeAsDate=helper.timeToDatetime(activity.activity_data.date, activity.activity_data.startTime); 
//               const endTimeAsDate=helper.timeToDatetime(activity.activity_data.date, activity.activity_data.endTime); %>
//         <!-- gets the date for the next Day -->
//         <%if (startTimeAsDate> endTimeAsDate) {%>
//         <% const nextDayDate=helper.nextDayDate(activity.activity_data.date); %>
//         (<%=nextDayDate%>)
//         <% } %>
//       </p>
//     </div>
//   </div>
// </a>
// <% } else if (activity.activity_model === "Fixture") {%>
// <a href="/<%= activity.activity_model.toLowerCase() %>/<%= activity.activity_data._id %>" class="card-link">
//   <div class="card mb-3">
//     <div class="card-body">
//       <h4 class="card-title"><%= activity.activity_data.team %> <%= activity.activity_data.venue %> vs <%= activity.activity_data.opponent %> @ <%=activity.activity_data.location %></h4>
//       <h6 class="card-subtitle mb-2 text-muted">
//         <%= activity.activity_data.date.toLocaleDateString("en-GB", {weekday: "long" ,
//                 year:"numeric", month:"long", day:"numeric"})%>
//       </h6>
//       <% if(activity.activity_data.meetTime !==0 ) {%>
//       <p class="card-text">
//         <strong>Meet Time:</strong>
//         <!-- gets meet time as in date format -->
//         <!-- AND gets meet time as the TIME ONLY -->
//         <% const meetTimeAsDate=helper.meetTimeToDate(activity.activity_data.date,
//           activity.activity_data.startTime, activity.activity_data.meetTime);
//           const meetTimeOnly=helper.dateToTimeOnly(meetTimeAsDate);
//           %>

//         <%=meetTimeOnly %>

//         <% if(meetTimeOnly> activity.activity_data.startTime) {%>
//         (<%= helper.dateToLocaleDateString(meetTimeAsDate)%>)
//         <%} %>
//       </p>
//       <% } %>
//       <p class="card-text">
//         <strong>Start Time:</strong>
//         <%= activity.activity_data.startTime %>
//       </p>
//       <p class="card-text">
//         <strong>End Time:</strong>
//         <%= activity.activity_data.endTime %>
//         <!-- will give date of the next day if endTime is before startTime -->
//         <!-- creates variables for start time and end Time in Datetime format -->
//         <% const startTimeAsDate=helper.timeToDatetime(activity.activity_data.date,
//                 activity.activity_data.startTime); const
//                 endTimeAsDate=helper.timeToDatetime(activity.activity_data.date,
//                 activity.activity_data.endTime); %>
//         <!-- gets the date for the next Day -->
//         <%if (startTimeAsDate> endTimeAsDate) {%>
//         <% const nextDayDate=helper.nextDayDate(activity.activity_data.date); %>
//         (<%=nextDayDate%>)
//         <% } %>
//       </p>

//     </div>
//   </div>
// </a>
// <% } else if (activity.activity_model === "Event") {%>
// <a href="/<%= activity.activity_model.toLowerCase() %>/<%= activity.activity_data._id %>" class="card-link">
//   <div class="card mb-3">
//     <div class="card-body">
//       <h4 class="card-title"><%= activity.activity_data.title %> @ <%=activity.activity_data.location %></h4>
//       <h6 class="card-subtitle mb-2 text-muted">
//         <%= activity.activity_data.date.toLocaleDateString("en-GB", {weekday: "long" ,
//                 year:"numeric", month:"long", day:"numeric"})%>
//         <% if (activity.activity_data.date.toLocaleDateString("en-GB", {weekday: "long" , year:"numeric", month:"long", day:"numeric"}) !== activity.activity_data.endDate.toLocaleDateString("en-GB", {weekday: "long" , year:"numeric", month:"long", day:"numeric"})) { %>
//         to <%= activity.activity_data.endDate.toLocaleDateString("en-GB", {weekday: "long" ,
//                   year:"numeric", month:"long", day:"numeric"})%>
//         <% } %>

//       </h6>
//       <% if(activity.activity_data.meetTime !==0 ) {%>
//       <p class="card-text">
//         <strong>Meet Time:</strong>
//         <!-- gets meet time as in date format -->
//         <!-- AND gets meet time as the TIME ONLY -->
//         <% const meetTimeAsDate=helper.meetTimeToDate(activity.activity_data.date,
//           activity.activity_data.startTime, activity.activity_data.meetTime);
//           const meetTimeOnly=helper.dateToTimeOnly(meetTimeAsDate);
//           %>

//         <%=meetTimeOnly %>

//         <% if (meetTimeOnly> activity.activity_data.startTime) { %>
//         (<%= helper.dateToLocaleDateString(meetTimeAsDate)%>)
//         <% } else { %>
//         on <%= activity.activity_data.date.toLocaleDateString("en-GB", {year:"numeric", month:"long", day:"numeric"}) %>
//         <% } %>
//       </p>
//       <% } %>
//       <p class="card-text">
//         <strong>Start Time:</strong>
//         <%= activity.activity_data.startTime %> on <%= activity.activity_data.date.toLocaleDateString("en-GB", {year:"numeric", month:"long", day:"numeric"}) %>
//       </p>

//       <p class="card-text">
//         <strong>End Time:</strong>
//         <%= activity.activity_data.endTime %> on <%= activity.activity_data.endDate.toLocaleDateString("en-GB", {year:"numeric", month:"long", day:"numeric"}) %>
//       </p>
//       <!-- <a href="/" class="stretched-link my-link"></a> -->
//     </div>
//   </div>
// </a>
// <% } %>
// <div class="text-center mb-3">
//   <a href="/schedule?page=<%= activities.nextPage %>" class="btn btn-primary">View More</a>
// </div>
// </div>`;