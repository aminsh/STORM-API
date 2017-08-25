"use strict";

module.exports = class HttpException {
    constructor(statusCode, statusMessage, error) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.error = error ? JSON.parse(error) : null;
    }
};
