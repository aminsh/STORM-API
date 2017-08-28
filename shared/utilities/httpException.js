"use strict";

module.exports = class HttpException {
    constructor(statusCode, statusMessage, error) {
        console.log(arguments);

        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.error = error ? JSON.parse(error) : null;
    }
};
