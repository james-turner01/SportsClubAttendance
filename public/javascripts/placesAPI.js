// function for places API
function initAutocomplete() {
    // get the three location inputs
    const trainingInput = document.getElementById('training-location');
    const fixtureInput = document.getElementById('fixture-location');
    const eventInput = document.getElementById('event-location');

    // bounds to bias search results to Exeter
    const defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(50.68290510022288, -3.5747492240262986),
      new google.maps.LatLng(50.76506066379149, -3.4683191677226946)
    );

    //options for the autocompletes
    const options = {
      componentRestrictions: {
        country: ['GB']
      },
      fields: ['name'],
      //fields: ['place_id', 'geometry', 'name'],
      bounds: defaultBounds,

    }

    try {
        // event listener in case enter is pressed when in the location text box to select an address - this stops the form trying to submit!
        trainingInput.addEventListener('keydown', (e) => {
        console.log("keydown", e.code)
        if (e.code === 'Enter') {
          e.preventDefault();
        }
      });

        // creates Places Autocomplete WIDGET for training location searchbox
        // note - it is important we are using a widget as this means session tokens are used by default (good for billing) (https://stackoverflow.com/questions/64032538/do-you-need-to-implement-session-tokens-when-using-google-autocomplete, https://stackoverflow.com/questions/56320025/new-google-places-autocomplete-and-its-pricing)
        const trainingLocationAutocomplete = new google.maps.places.Autocomplete(trainingInput, options);
        // place_changed means the user has selected a palce from the dropdown suggestions
        trainingLocationAutocomplete.addListener('place_changed', function() {
        const place = trainingLocationAutocomplete.getPlace();
        console.log("PLACE", place)
        console.log("place name", place.name)

        if (!place.name) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            trainingInput.value = '';
            return;
        }
        });
    } catch {
        console.log("no training location input")
    }

    // *****FOR FIXTURE FORM ************8
    try {
        // event listener in case enter is pressed when in the location text box to select an address - this stops the form trying to submit!
        fixtureInput.addEventListener('keydown', (e) => {
        console.log("keydown", e.code)
        if (e.code === 'Enter') {
          e.preventDefault();
        }
      });


        // creates Places Autocomplete WIDGET for fixture location searchbox
        const fixtureLocationAutocomplete = new google.maps.places.Autocomplete(fixtureInput, options);
        fixtureLocationAutocomplete.addListener('place_changed', function() {
        const place = fixtureLocationAutocomplete.getPlace();
        console.log("PLACE", place)
        console.log("place name", place.name)

        if (!place.name) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            trainingInput.value = '';
            return;
        }
        });
    } catch {
        console.log("no fixture location input")
    }

    try {
        // *****FOR FEVENT FORM ************
        // event listener in case enter is pressed when in the location text box to select an address - this stops the form trying to submit!
        eventInput.addEventListener('keydown', (e) => {
        console.log("keydown", e.code)
        if (e.code === 'Enter') {
            e.preventDefault();
        }
        });

        // creates Places Autocomplete WIDGET for event location searchbox
        const eventLocationAutocomplete = new google.maps.places.Autocomplete(eventInput, options);
        eventLocationAutocomplete.addListener('place_changed', function() {
        const place = eventLocationAutocomplete.getPlace();

        if (!place.name) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            trainingInput.value = '';
            return;
        }
        });
    } catch {
        console.log("no event location input")
    }
  }