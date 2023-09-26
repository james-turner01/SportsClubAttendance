// JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    window.addEventListener('load', function() {
      // Fetch all the forms we want to apply custom validation styles
      const inputs = document.getElementsByClassName('input')
  
      // Loop over each input and watch blur event
      Array.prototype.filter.call(inputs, function(input) {
  
      input.addEventListener('blur', () => {
      // removes the class is-invalid and s-valid from the input
      input.classList.remove('is-invalid')
      input.classList.remove('is-valid')

      // if the input is invalid, add the class is-invalid
      if (input.checkValidity() === false) {
        // console.log("invalid")
        input.classList.add('is-invalid')
      }
      // else add the class is-valid
      else {
        // console.log("valid")
        input.classList.add('is-valid')
      }
      }, false);
      });
    }, false);
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation') // find all forms on webpage based on class needs-validation

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => { // for each from we find
      form.addEventListener('submit', event => { // add an even listener for a submit
        console.log(form.checkValidity())
        if (!form.checkValidity()) { // call function to check if form is NOT valid
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
        console.log('added was validated class')
      }, false)
    })
  })()