//catchAsync wrapper function that adds a try catch around any of our async function in our app.js routes to catch any errors
// this wrapper function accepts a function (func) as an argument
module.exports = func => {
    return (req, res, next) => {
        // then execute the function (func) BUT catches any errors and passes them to next
        func (req, res, next).catch(next);
    }
}