console.log("ATTENDANCEFORM.JS")
// access the attendance form
const attendanceForm = document.getElementById("attendance-form")
console.log("attendance form", attendanceForm)

//current window
const currentURL = window.location.pathname
console.log("current url", currentURL)

// event is defined in a script in training/show.ejs
console.log("training id in attendanceForm.js", event)

if (attendanceForm) {
    // add eventlistener for when the form is submitted
    attendanceForm.addEventListener("submit", function(e) {
        //prevent the page from reloading
        e.preventDefault();

        //using fetch to send through the data submitted in the form
        // submitting it as URLEncodedString (how a form normally submits data)

        //saving the formData in FormData format
        const formData = new FormData(attendanceForm);
        console.log("formData", formData)
        // setting the formData note so that it does not include < or > values and replacing them with "&lt;" and "&gt;" repectively
        // note: this is to prevent html injection
        formData.set("attendant[note]", formData.get("attendant[note]").replace(/</g, "&lt;").replace(/>/g, "&gt;"))
        //convert the formData into urleconded format
        const data = new URLSearchParams(formData);

        // getting the going and note values to be submitted in the below fetch request
        const goingValue = formData.get("attendant[going]")
        const noteValue = formData.get("attendant[note]")
        console.log("notevalue", noteValue)

        if(currentURL.slice(1,9) === "training") {
            console.log("TRAINING PATH")
            //fetch request
        fetch(`/training/${event}/attendance`, {
            method: 'PUT',
            // don't have to specify the header, the browser can correctly infer what the format is
            // headers: {
            //   'Content-Type': 'application/x-www-form-urlencoded'
            // },
            body: data
        })
        // takes the response from the fetch methd
        //response. json() method parses the JSON data as a JavaScript object
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
        } else if (currentURL.slice(1,8) === "fixture") {
            console.log("FIXTURE PATH")
            //fetch request
        fetch(`/fixture/${event}/attendance`, {
            method: 'PUT',
            body: data
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
        } else if (currentURL.slice(1,6) === "event") {
            console.log("EVENT PATH")
            //fetch request
        fetch(`/event/${event}/attendance`, {
            method: 'PUT',
            body: data
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
        }
        // getting the username of the attendant from the attendance form
        const loggedInUsername = document.getElementById("attendantUsername").textContent.trim()
        console.log("loggedinusername:",loggedInUsername,".", loggedInUsername.length)
        // after the fetch api is run, run addAttendanceHTML function
        // note: this function is only called when the attendace form s visible on the page and the fetch request has been sent
        addAttendanceHTML(loggedInUsername, goingValue, noteValue)
    })
} else {
    // the attendance form is not visible
    console.log("no attendance form")
}

// function that will add the attednat to the attendance list
function addAttendanceHTML(username, going, note) {
    // first part of the HTML to add to the attendants card (the username)
    const partOne = `<div class="col pe-sm-0">${username}</div>`
    
    // second part of the HTML to add to the attendants card (the note)
    const partTwo = (() => {
        // if the note is NOT falsey (i.e. not an empty string)
        if (note) {
            console.log("note in function",note)
            const templatePartTwo = `<div class="col-12 col-sm-5 pe-sm-0 pt-1 pt-sm-0 text-end text-sm-start">Note: ${note}</div>`
            return templatePartTwo
        }
    // otherwise, templatePartTwo is an empty string
    templatePartTwo = ""
    return templatePartTwo
    })()
    
    // third part of the HTML to add to the attendants card (going, not going or no answer)
    const partThree = (() => {
        if (going === '3') {
            const templatePartThree = `<div class="col-4 col-sm-3 order-sm-last ps-0 text-end">No Answer</div>`
            return templatePartThree
        } else if (going === '2') {
            const templatePartThree = `<div class="col-4 col-sm-3 order-sm-last ps-0 text-end">Not Going</div>`
            return templatePartThree
        } else {
            const templatePartThree = `<div class="col-4 col-sm-3 order-sm-last ps-0 text-end">Going</div>`
            return templatePartThree
        }
    })()
    // get the div with id of attendants
    const attendantsContainingDiv = document.getElementById("attendants")
    // get the element where the username on the form matches the id of a division in the attendants 'list'
    // note: if no element is foudn, then matchingAttendant = null
    const matchingAttendant = document.getElementById(username)
    console.log("matching attendant", matchingAttendant)

    // if there is an element that has an id = username, adjust the inner html of matchingAttendant
    if (matchingAttendant) {
        console.log("person already attending")
        matchingAttendant.innerHTML = partOne + partTwo + partThree

        //find the existing alert (if there is one) on the page and remove it
        const alertFind = document.querySelector('.alert')
        if(alertFind){
            alertFind.remove()            
        }

        //adding success alert that attendance has been UPDATED
        const container = document.querySelector(".card-body")
        console.log(container)
        container.insertAdjacentHTML("afterend",
        `
        <div class='alert alert-success alert-dismissible fade show' data-timeout='2000' role='alert'> Attendance updated successfully!
            <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button
        </div>
        `)

        const myAlert = document.querySelector('.alert');
        console.log("myalert", myAlert)
        const bsAlert = new bootstrap.Alert(myAlert);
        console.log("bsAlert",bsAlert)
        const alertTimeout = myAlert.getAttribute('data-timeout');
        console.log("alertTimeout", alertTimeout, typeof alertTimeout)
        
        console.log("myAlert", myAlert)
        console.log("bsAlert", bsAlert)
        setTimeout(() => {
            bsAlert.close();
        }, + alertTimeout);
        
        
    // else, add the new attendant to the bottom of the attendants 'list'
    } else {
        console.log("new attendant")
        //find element with id "no-attendants"
        const noAttendantsDiv = document.getElementById("no-attendants")
        if (noAttendantsDiv) {
            noAttendantsDiv.remove()
        }
        template = `<div class="row mb-3" id="${username}">`+ partOne + partTwo + partThree + '</div>'
        attendantsContainingDiv.insertAdjacentHTML("beforeend", template)

        //find the existing alert (if there is one) on the page and remove it
        const alertFind = document.querySelector('.alert')
        if(alertFind){
            alertFind.remove()            
        }

        //adding success alert to say that attendance has been ADDED
        //adding success alert that attendance has been UPDATED
        const container = document.querySelector(".card-body")
        console.log(container)
        container.insertAdjacentHTML("afterend",
        `
        <div class='alert alert-success alert-dismissible fade show' data-timeout='2000' role='alert'> Attendance updated successfully!
            <button type='button' class='btn-close' data-bs-dismiss='alert' aria-label='Close'></button
        </div>
        `)

        // access the alert just added to the html (above), create a bootstrap alert, setTimeout for the alert so that it automatically closes after data-teimout time (ms)
        const myAlert = document.querySelector('.alert');
        console.log("myalert", myAlert)
        const bsAlert = new bootstrap.Alert(myAlert);
        //console.log("bsAlert",bsAlert)
        const alertTimeout = myAlert.getAttribute('data-timeout');
        //console.log("alertTimeout", alertTimeout, typeof alertTimeout)
        
        //console.log("myAlert", myAlert)
        //console.log("bsAlert", bsAlert)
        setTimeout(() => {
            bsAlert.close();
        }, + alertTimeout);
    }
}