
export class ValidationException {
    constructor(errors) {
        this.errors = errors;
    }
}

export class ValidationSingleException {
    constructor(message) {
        this.message = message;
    }
}

export class NotFoundException {

}
