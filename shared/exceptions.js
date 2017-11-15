"use strict";

class ValidationException {
    constructor(errors) {
        this.errors = errors;
    }
}

global.ValidationException = ValidationException;