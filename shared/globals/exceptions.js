"use strict";

class ValidationException {
    constructor(errors) {
        this.errors = errors;
    }
}

module.exports = {
    ValidationException
};