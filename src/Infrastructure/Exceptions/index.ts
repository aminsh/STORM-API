export class ValidationException {
    constructor(public errors: string[]) {
    }
}

export class BadRequestException {
    constructor(public message: string | string[]) {
    }
}

export class ValidationSingleException {
    constructor(public message: string) {
    }
}

export class ForbiddenException {
    constructor(public message: string) {
    }
}

export class NotFoundException {
}