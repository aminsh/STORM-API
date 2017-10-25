"use strict";

class DomainException {
    constructor(errors) {
        this.errors = errors;
    }
}

function DomainResponse(result, response) {
    if(result.isValid)
        response.status(200).json(result.returnValue);

    else
        response.status(400).json(result.errors);
}


module.exports = {DomainException, DomainResponse};
