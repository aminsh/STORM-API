var fs = require('fs');
var config = require('../config');

function exceptionHandler(err, req, res, next) {
    debugger;

    next();
}

module.exports = exceptionHandler;