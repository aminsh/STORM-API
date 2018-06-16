"use strict";

class ValidationException {
    constructor(errors) {
        this.errors = errors;
    }
}

class ValidationSingleException {
    constructor(message) {
        this.message = message;
    }
}

class NotFoundException {

}

module.exports = {
    ValidationException,
    ValidationSingleException,
    NotFoundException
};