"use strict";


function exceptionHandler(err, req, res, next) {
    debugger;
    //Raven.captureException(err);
    next();
}

module.exports = exceptionHandler;