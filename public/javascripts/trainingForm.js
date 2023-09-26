console.log("TRAINING FORM JS LOADED")
// checks to see repeat session checkbox is ticked
function isChecked() {
    const checkBox = document.getElementById("repeatCheckbox");

    const repeatUntilDiv = document.getElementById("repeat-until");

    const repeatEndDateInput = document.getElementById("repeat-end");

    const startDateInput = document.getElementById("training-date");

    if (checkBox.checked === true) {
        repeatUntilDiv.style.display = "block";
        // sets the hidden checkbox to be disabled so ti does NOT submit value of 'off' to the DB
        document.getElementById('repeatCheckboxHidden').disabled = true;
        // sets the required property to true for the repeat-end date
        document.getElementById("repeat-end").required = true;

        // sets min and value for repeat-end to be 7 days after whatever the start date is ONLY wwhen repeat session checkbox is ticked
        repeatEndDateInput.value = new Date((new Date(startDateInput.value).getTime() + 7 * 24 * 60 * 60 * 1000)).toLocaleDateString("en-CA")
        
        // CHECKING THE VALIDITY OF THE repeat-end date WHEN THE start DATE CHANGES
        // remove any occurance of is-invalid or is-valid class to eventEndDate input
        repeatEndDateInput.classList.remove('is-invalid')
        repeatEndDateInput.classList.remove('is-valid')

        // if repeat-end date is not valid, add is-invalid class to repeat-end date input
        if(repeatEndDateInput.checkValidity() === false) {
            repeatEndDateInput.classList.add('is-invalid')
        } else {
            // else add is-valid class
            repeatEndDateInput.classList.add('is-valid')
        }
    } else {
        repeatUntilDiv.style.display = "none";
        // sets the hidden checkbox to be disabled so ti can submit value of 'off' to the DB
        document.getElementById('repeatCheckboxHidden').disabled = false;
        // sets the required property to false for the repeat-end date
        document.getElementById("repeat-end").required = false;
        // if checkBox is unchechecked the min and value for repeat end date need to be removed
        repeatEndDateInput.value = null;
        repeatEndDateInput.removeAttribute("min");
    }
}

function checkEndTime(startTime, endTime, hoursToAdd) {
    if (startTime.value === "") {
        console.log("no start time")
    } else if (endTime.value === "") {
        const startTimeNum = Number(startTime.value.replace(":", ""));
        var endTimePlusHoursAdded = (startTimeNum + (hoursToAdd * 100)).toString()
        //console.log(endTimePlusOneHour)
        if (endTimePlusHoursAdded > 2400) {
            endTimePlusHoursAdded = (endTimePlusHoursAdded - 2400).toString()
        }
        if (endTimePlusHoursAdded.length < 4) {
            endTimePlusHoursAdded = '0'.repeat(4 - endTimePlusHoursAdded.length) + endTimePlusHoursAdded
        }
        const endTimeColon = endTimePlusHoursAdded.slice(0, 2) + ":" + endTimePlusHoursAdded.slice(2);
        endTime.value = endTimeColon
    }
}


function changeRepeatEndMinDate() {
    const checkBox = document.getElementById("repeatCheckbox");

    const repeatEndDateInput = document.getElementById("repeat-end");

    const startDateInput = document.getElementById("training-date");
    const date = new Date()
    // gets the date seven days after the start date
    sevenDaysAfterStartDate = new Date((new Date(startDateInput.value).getTime() + 7 * 24 * 60 * 60 * 1000)).toLocaleDateString("en-CA")
    // if the sevenDaysAfterStartDate is after today's date, set the repeat-end date min value to sevenDaysAfterStartDate
    if (sevenDaysAfterStartDate > date.toLocaleDateString('en-CA')) {
        repeatEndDateInput.min = sevenDaysAfterStartDate
    // otherwise set the minimum value to todays date
    } else {
        repeatEndDateInput.min = date.toLocaleDateString('en-CA')
    }
    
    //if checkBox is ticked, need to check validity of repeat until date (at least 7 days or later than start date)
    if (checkBox.checked === true) {
        // CHECKING THE VALIDITY OF THE repeat-end date WHEN THE start DATE CHANGES
        // remove any occurance of is-invalid or is-valid class to eventEndDate input
        repeatEndDateInput.classList.remove('is-invalid')
        repeatEndDateInput.classList.remove('is-valid')

        // if repeat-end date is not valid, add is-invalid class to repeat-end date input
        if(repeatEndDateInput.checkValidity() === false) {
            repeatEndDateInput.classList.add('is-invalid')
        } else {
            // else add is-valid class
            repeatEndDateInput.classList.add('is-valid')
        }
    }
}

// object to be used for meet time dropdown menu
const meetTimeOptions = {
    "No meet time": "",
    "5 minutes before": "",
    "10 minutes before": "",
    "15 minutes before": "",
    "20 minutes before": "",
    "25 minutes before": "",
    "30 minutes before": "",
    "45 minutes before": "",
    "60 minutes before": "",
    "90 minutes before": "",
    "120 minutes before": "",
};

const displayForm = function(id) {
    // resets any validation that may have been done in any form
    const elements = document.querySelectorAll('.is-valid, .is-invalid');
    elements.forEach((element) => {
      element.classList.remove('is-valid', 'is-invalid');
    });

    if (document.getElementById(id).style.display === 'none') {
        document.getElementById(id).style.display = 'block'
    }

    if (id === 'training-form') {
        document.getElementById('form-training').classList.add("was-validated")
        document.getElementById('form-training').classList.remove("was-validated")
        formToggle('fixture-form');
        formToggle('event-form');
    }
    if (id === 'fixture-form') {
        console.log('fixture form')
        formToggle('training-form');
        formToggle('event-form');

    }
    if (id === 'event-form') {
        console.log('event form')
        formToggle('training-form');
        formToggle('fixture-form');
}
}

const formToggle = function(a) {
    if ( document.getElementById(a).style.display !== 'none') {
        return document.getElementById(a).style.display = 'none';
    }
}

const buttonStyle = function(a) {
    console.log(a)
    const trainingButton = document.getElementById('training-btn');
    const fixtureButton = document.getElementById('fixture-btn');
    const eventButton = document.getElementById('event-btn');
    if (a === 'training-btn') {
        console.log('training btn style')
        if (trainingButton.classList.contains('btn-outline-success')) {
            trainingButton.classList.remove('btn-outline-success')
            trainingButton.classList.add('btn-success')
            if (fixtureButton.classList.contains('btn-primary')) {
                fixtureButton.classList.remove('btn-primary')
                fixtureButton.classList.add('btn-outline-primary')
            }
            if (eventButton.classList.contains('btn-danger')) {
                eventButton.classList.remove('btn-danger')
                eventButton.classList.add('btn-outline-danger')
            }
        }
    }
    if (a === 'fixture-btn') {
        console.log('fixture btn style')
        if (fixtureButton.classList.contains('btn-outline-primary')) {
            fixtureButton.classList.remove('btn-outline-primary')
            fixtureButton.classList.add('btn-primary')
            if (trainingButton.classList.contains('btn-success')) {
                trainingButton.classList.remove('btn-success')
                trainingButton.classList.add('btn-outline-success')
            }
            if (eventButton.classList.contains('btn-danger')) {
                eventButton.classList.remove('btn-danger')
                eventButton.classList.add('btn-outline-danger')
            }
        }
    }
    if (a === 'event-btn') {
        console.log('event btn style')
        if (eventButton.classList.contains('btn-outline-danger')) {
            eventButton.classList.remove('btn-outline-danger')
            eventButton.classList.add('btn-danger')
            if (trainingButton.classList.contains('btn-success')) {
                trainingButton.classList.remove('btn-success')
                trainingButton.classList.add('btn-outline-success')
            }
            if (fixtureButton.classList.contains('btn-primary')) {
                fixtureButton.classList.remove('btn-primary')
                fixtureButton.classList.add('btn-outline-primary')
            }
        }
    }
}

// checks to see if the dropdown menu has selected 'Other' if it has display a text box to add an option
function opponentSelect(opponent) {
        const opposition = document.getElementById(opponent).value;
        if (opposition === 'Other') {
            console.log("opponent is other!")
            document.getElementById("otherTeam").setAttribute("name","fixture[opponent]");
            document.getElementById("otherTeam").style.display = 'block';
            document.getElementById("otherTeamInput").setAttribute("required", "");

        } else {
            document.getElementById("otherTeam").setAttribute("name","");
            document.getElementById("otherTeam").style.display = 'none';
            document.getElementById("otherTeamInput").removeAttribute("required");
        }

}

// function that will set startdate as todays date as VALUE and as MIN, sets the start time min and value as the next nearest hour and set the end time value to be one hour after the starttime
function startDateAndTimeValueValidate(startDateIdString, startTimeIdString, endTimeIdString) {
    const startDateInput = document.getElementById(startDateIdString);
    const startTimeInput = document.getElementById(startTimeIdString);
    const endTimeInput = document.getElementById(endTimeIdString);
    //get's todays date
    const date = new Date()

    const timeOnFormLoad = String(date.getHours()).padStart(2, '0')+":"+String(date.getMinutes()).padStart(2, '0');

    //sets startDateInput MIN to be todays date
    startDateInput.min = date.toLocaleDateString('en-CA');

    // setting an initial min value for startTime and endTime as the current time
    startTimeInput.min = String(date.getHours()).padStart(2, '0')+":"+String(date.getMinutes()).padStart(2, '0');

    // for EVENT form, need to set the event-end-date min
    if (startDateIdString === "event-date") {
        console.log("IT'S EVENT TIME BABY!")
        const endDateInput = document.getElementById("event-end-date");
        endDateInput.min = date.toLocaleDateString('en-CA');
    }
    

    //set hours, minutes, seconds, milliseconds for date object to be hour +1 and mins, secs, ms to 00
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setHours(date.getHours()+1)
    //console.log(date)


    // if the time when the form loads is greater than the time that the time rounded up to then set the min value for start and end time as the time rounded up to the next hour
    // e.g. is the time is 23:55, rounded up is 00:00 so 23:55 > 00:00 so the min for start time and end time will be 00:00
    if(timeOnFormLoad > String(date.getHours()).padStart(2, '0')+":00") {
        console.log("the next day")
        startTimeInput.min = String(date.getHours()).padStart(2, '0')+":00";
        endTimeInput.min = "00:00";
    }
    // setting startTime value
    startTimeInput.value = String(date.getHours()).padStart(2, '0')+":00";

    endTimeInput.min = String(date.getHours()).padStart(2, '0')+":00";
    // set startDateInput value to be date yyyy-mm-dd
    // gets todays date in yyyy-mm-dd by using en-CA
    startDateInput.value = date.toLocaleDateString('en-CA');

    if (startDateIdString === "event-date") {
        console.log("IT'S EVENT TIME BABY!")
        const endDateInput = document.getElementById("event-end-date");
        endDateInput.value = date.toLocaleDateString('en-CA');
    }
    

    // setting endTime initial value
    if (date.getHours() === 23) {
        // adding one hour to date.getHours() would give 24 but that would cause an error as 24:00 needs to be 00:00
        endTimeInput.value = "00:00"
        endTimeInput.min = "00:00"
    } else {
        endTimeInput.value = String(date.getHours()+1).padStart(2,'0')+":00";
    }

    if (endTimeInput.value < startTimeInput.value && startDateIdString === "event-date") {
        console.log("the end date will be", date)
        const endDateInput = document.getElementById("event-end-date");
        date.setHours(date.getHours()+1)
        console.log("the end date will be", date)
        endDateInput.value = date.toLocaleDateString('en-CA')
    } 
    console.log("WOOOOOOOOOOOOOOOOOOOOOO", startDateIdString)
    
    // if we are NOT on the event form the end, set the endTime MIN as 00:00
    if (startDateIdString !== "event-date") {
        endTimeInput.min = "00:00";
    } 
    return
}

// function that will run if training date is changed, it will adjust the mins for start-time, end-time
function onStartDateChange(startDateIdString, startTimeIdString, endTimeIdString) {
    console.log("ONSTARTDATECHANGE")
    const startDateInput = document.getElementById(startDateIdString);
    const startTimeInput = document.getElementById(startTimeIdString);
    const endTimeInput = document.getElementById(endTimeIdString);
    const date = new Date();
    const datePlusHour = new Date (date.getTime() + 60 *60 *1000);

    if (startDateInput.value === date.toLocaleDateString("en-CA")) {
        // setting startTime value
        startTimeInput.min = String(date.getHours()).padStart(2, '0')+":"+String(date.getMinutes()).padStart(2, '0');
        // setting endTime initial value
        endTimeInput.min = String(date.getHours()).padStart(2, '0')+":"+String(date.getMinutes()).padStart(2, '0');
        console.log(datePlusHour.getHours(), "<", date.getHours())

        // if the time 1 hour later than the form load time is less (e.g. hour 00 < hour 23, set endTime min as 00:00 (i.e. assuming the end time can be any time for the next day))
        if (datePlusHour.getHours() < date.getHours()) {
            endTimeInput.min = "00:00"
        }
    } else {
        startTimeInput.min = "00:00";
        endTimeInput.min = "00:00";
    }

    // CHECKING THE VALIDITY OF THE start time WHEN THE start DATE CHANGES
    // remove any occurance of is-invalid or is-valid class to eventEndDate input
    startTimeInput.classList.remove('is-invalid')
    startTimeInput.classList.remove('is-valid')

    // if eventEndDate is not valid, add is-invalid class to eventEndDate input
    if(startTimeInput.checkValidity() === false) {
        startTimeInput.classList.add('is-invalid')
    } else {
        // else add is-valid class
        startTimeInput.classList.add('is-valid')
    }

    // CHECKING THE VALIDITY OF THE end time WHEN THE start DATE CHANGES
    // remove any occurance of is-invalid or is-valid class to eventEndDate input
    endTimeInput.classList.remove('is-invalid')
    endTimeInput.classList.remove('is-valid')

    // if eventEndDate is not valid, add is-invalid class to eventEndDate input
    if(endTimeInput.checkValidity() === false) {
        endTimeInput.classList.add('is-invalid')
    } else {
        // else add is-valid class
        endTimeInput.classList.add('is-valid')
    }
}

// function for EVENT form
// will run when the 1) event-date changes, 2) event-end-date changes,3) event-start-time changes
// if the start Date and end Date are the same, set the event-end-time MIN to equal whatever the event-time value is
function eventStartandEndDateCheck(id) {
    const eventStartDate = document.getElementById("event-date");
    const eventEndDate = document.getElementById("event-end-date");
    const eventStartTime = document.getElementById("event-start-time");
    const eventEndTime = document.getElementById("event-end-time");
    // date abd time when form loads
    const date = new Date()
    // console.log(date)
    const time = String(date.getHours()).padStart(2, '0')+":"+String(date.getMinutes()).padStart(2, '0');
    // console.log(time)
    const year = date.toLocaleString("default", { year: "numeric" });
    const month = date.toLocaleString("default", { month: "2-digit" });
    const day = date.toLocaleString("default", { day: "2-digit" });
    const formattedDate = year + "-" + month + "-" + day;
    // if the event date is changed
    if (id === "event-date") {
        console.log('event-date changed')
        if (eventStartDate.value < formattedDate){
            console.log("start Date is less than today's date!")
            eventEndDate.min = formattedDate;
        } else if (eventStartDate.value === eventEndDate.value) {
            console.log('start date is the SAME as end date')
            eventEndTime.min = eventStartTime.value;
            eventEndDate.min = eventStartTime.value;
            // if the start date is todays date
            if (eventStartDate.value === formattedDate){
                //  set the min for the startTime and endTime to be time calculated above
                eventStartTime.min = time;
                eventEndTime.min = time;
            }
        } else {
            console.log("start date is DIFF to end date")
            eventEndDate.min = eventStartDate.value;
        }

        // CHECKING THE VALIDITY OF THE END DATE WHEN THE START DATE CHANGES
        // remove any occurance of is-invalid or is-valid class to eventEndDate input
        eventEndDate.classList.remove('is-invalid')
        eventEndDate.classList.remove('is-valid')

        // if eventEndDate is not valid, add is-invalid class to eventEndDate input
        if(eventEndDate.checkValidity() === false) {
            eventEndDate.classList.add('is-invalid')
            eventEndTime.classList.remove('is-invalid')
            eventEndTime.classList.remove('is-valid')
            eventEndTime.classList.add('is-invalid')
        } else {
            // else add is-valid class
            eventEndDate.classList.add('is-valid')
        }

        // CHECKING THE VALIDITY OF THE start Time WHEN THE START Time CHANGES
        // remove any occurance of is-invalid or is-valid class to eventEndDate input
        eventStartTime.classList.remove('is-invalid')
        eventStartTime.classList.remove('is-valid')

        // if eventStartTime is not valid, add is-invalid class to eventEndTime input
        if(eventStartTime.checkValidity() === false) {
            eventStartTime.classList.add('is-invalid')
        } else {
            // else add is-valid class
            eventStartTime.classList.add('is-valid')
        }
    } else if (id ==="event-start-time") {
        console.log('event-start-time changed')
        if (eventStartDate.value === eventEndDate.value) {
            console.log('start date is the SAME as end date')
            eventEndTime.min = eventStartTime.value;
        }
        eventEndDate.min = eventStartDate;

        // CHECKING THE VALIDITY OF THE END Time WHEN THE START Time CHANGES
        // remove any occurance of is-invalid or is-valid class to eventEndDate input
        eventEndTime.classList.remove('is-invalid')
        eventEndTime.classList.remove('is-valid')

        // if eventEndTime is not valid, add is-invalid class to eventEndTime input
        if(eventEndTime.checkValidity() === false) {
            eventEndTime.classList.add('is-invalid')
        } else {
            // else add is-valid class
            eventEndTime.classList.add('is-valid')
        }
        
    } else if (id==="event-end-date") {
        console.log('event-end-date changed')
        if (eventStartDate.value === eventEndDate.value) {
            console.log('start date is the SAME as end date')
            eventEndTime.min = eventStartTime.value;
        } else {
            console.log("end date different to start date")
            eventEndTime.min = "00:00";
        }

        // CHECKING THE VALIDITY OF THE END Time WHEN THE START Time CHANGES
        // remove any occurance of is-invalid or is-valid class to eventEndDate input
        eventEndTime.classList.remove('is-invalid')
        eventEndTime.classList.remove('is-valid')

        // if eventEndTime is not valid, add is-invalid class to eventEndTime input
        if(eventEndTime.checkValidity() === false) {
            eventEndTime.classList.add('is-invalid')
        } else {
            // else add is-valid class
            eventEndTime.classList.add('is-valid')
        }
    }
}

//function for EVENT form
// if the start date is changed, the end date min needs to  to the start date
function homeAwaySelect(id) {
    const element = document.getElementById(id);
    const hiddenCheckbox = document.getElementById("homeAwayCheckboxValidation");
    // if 'Home' or 'Away' are checked, check the hidden radio button
    if (element.checked) {
        hiddenCheckbox.checked = true;
    } else {
        hiddenCheckbox.checked = false;
    }

    // removes the class is-invalid and s-valid from the hiddenRadio input
    hiddenCheckbox.classList.remove('is-invalid')
    hiddenCheckbox.classList.remove('is-valid')

    // if the hiddenRadio is invalid, add the class is-invalid
    if (hiddenCheckbox.checkValidity() === false) {
        input.classList.add('is-invalid')
    }
    // else add the class is-valid to the hiddenRadio
    else {
        console.log("valid")
        hiddenCheckbox.classList.add('is-valid')
    }
}

//functiont that runs when body is loaded in (see in boilerplate)
// if we are at the path /training/new run startDateAndTimeValueValidate('training-date', 'training-start-time', 'training-end-time')
function onPageLoad() {
    console.log("window", window.location.pathname, (window.location.pathname === "/training/new"))
    console.log(window.location.pathname.slice(-5), (window.location.pathname.slice(-5) === "/edit"))
    if (window.location.pathname === "/training/new") {
        console.log("running startDateAndTimeValueValidate('training-date', 'training-start-time', 'training-end-time')")
        startDateAndTimeValueValidate('training-date', 'training-start-time', 'training-end-time')
    // if on edit FORM page
    } else if (window.location.pathname.slice(-5) === "/edit") {
        const date = new Date();
        if (window.location.pathname.slice(0,9) === "/training") {
            console.log("training edit page")
            const startDate = document.getElementById("training-date")
            const startTime = document.getElementById("training-start-time")
            // set start date min to todays date
            startDate.min = date.toLocaleString("default", { year: "numeric" }) + "-" + date.toLocaleString("default", { month: "2-digit" }) + "-" + date.toLocaleString("default", { day: "2-digit" });
            // if the start date value ==== start date min, set the start TIME min to be the load time of the form
            if (startDate.value === startDate.min) {
                console.log("set start time min")
                const time = String(date.getHours()).padStart(2, '0')+":"+String(date.getMinutes()).padStart(2, '0');
                console.log(time)
                startTime.min = time;
         }
        } else if (window.location.pathname.slice(0,8) === "/fixture"){
            //console.log("fixture edit page")
            const startDate = document.getElementById("fixture-date")
            const startTime = document.getElementById("fixture-start-time")
            // set start date min to todays date
            startDate.min = date.toLocaleString("default", { year: "numeric" }) + "-" + date.toLocaleString("default", { month: "2-digit" }) + "-" + date.toLocaleString("default", { day: "2-digit" });
            // if the start date value ==== start date min, set the start TIME min to be the load time of the form
            if (startDate.value === startDate.min) {
                console.log("set start time min")
                const time = String(date.getHours()).padStart(2, '0')+":"+String(date.getMinutes()).padStart(2, '0');
                console.log(time)
                startTime.min = time;
            }
        } else if (window.location.pathname.slice(0,6) === "/event"){
            //console.log("event edit page")
            const startDate = document.getElementById("event-date")
            const startTime = document.getElementById("event-start-time")
            const endDate = document.getElementById("event-end-date")
            const endTime = document.getElementById("event-end-time")
            // set start date min to todays date
            startDate.min = date.toLocaleString("default", { year: "numeric" }) + "-" + date.toLocaleString("default", { month: "2-digit" }) + "-" + date.toLocaleString("default", { day: "2-digit" });
            // set end date min to start date
            endDate.min = startDate.value;
            // if the start date value ==== start date min, set the start TIME min to be the load time of the form
            if (startDate.value === startDate.min) {
                //console.log("set start time min")
                const time = String(date.getHours()).padStart(2, '0')+":"+String(date.getMinutes()).padStart(2, '0');
                //console.log(time)
                startTime.min = time;
            }
            if (endDate.value === endDate.min) {
                console.log("set start time min")
                // const time = String(date.getHours()).padStart(2, '0')+":"+String(date.getMinutes()).padStart(2, '0');
                // console.log(time)
                endTime.min = startTime.value;
            }
        } else {
            console.log("NOT LOADING")
        }
    }
}


// this function compares the start and end times for a training session or fixture.
// if the end time appears to be before the start time, a warning will appear.
function startEndDateWarningCheck(occasion) {
    // console.log(occasion)
    const startTime = document.getElementById(occasion + "-start-time");
    const endTime = document.getElementById(occasion + "-end-time");
    if(endTime.value < startTime.value) {
        console.log("end time less than start time")
        const date = document.getElementById(occasion + "-date");
        // console.log(date.value)
        const nextDayDate = new Date(new Date(date.value).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", 
        {
            weekday: "long",
            year: "numeric", 
            month: "long", 
            day: "numeric"
        });
        document.getElementById(occasion + "WarningAlertDiv").textContent = "";
        document.getElementById(occasion + "WarningAlertDiv").insertAdjacentHTML("afterbegin", "<div class='mb-3 alert alert-warning alert-dismissible show' id='trainingEndTimeWarning' role='alert'>Please note the end time is before the start time! <br> If you submit the form, it will be assumed the end time is for the next day.<br>i.e. The end time would be " + endTime.value + " on "+ nextDayDate +".<button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button></div>")
    } else {
        document.getElementById(occasion + "WarningAlertDiv").innerHTML=""
    }
}

// function that resets the alert when the form select button is clicked (for training and fixture)
function resetAlert(occasion){
    document.getElementById(occasion + "WarningAlertDiv").innerHTML=""    
}