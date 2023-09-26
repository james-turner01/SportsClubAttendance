// definining our class
// the class ExpressError EXTENDS the native built-in 'Error'
// extends means the class 'ExpressError' will inherit the methods from the 'Error' classs 
class ExpressError extends Error {
    constructor(message, statusCode) {
        // super() will call the Error constructor inside the ExpressError constructor and thus get access to 'Error's' properties and methods
        super();
        // this.message will equal whatever message was passed in
        this.message = message;
        // this.status will equal whatever status was passed in
        this.statusCode = statusCode;
    }
}

module.exports = ExpressError;