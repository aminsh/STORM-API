"use strict";

module.exports = class DomainException {
    constructor(errors) {
        this.errors = errors;
    }
};
