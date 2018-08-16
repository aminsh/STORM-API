declare global {
    const EventEmitter: IEventEmitter,
        Utility: IUtility,
        ValidationException: ValidationException,
        ValidationSingleException: ValidationSingleException,
        NotFoundException: NotFoundException,
        Enums: any
}

declare interface IEventEmitter {
    emit(name: string, ...args): void;

    on(event: string, listener: Function): void;
}

declare interface IUtility {
    String: IString;
    Guid: IGuid;
    PersianDate: IPersianDate;
    TokenGenerator: ITokenGenerator;
    isUndefined(obj: any): boolean;
    delay(milliseconds: number): void;
    kendoQueryResolve(query: any, request: any, mapper: Function)
}

declare interface IString {
    isNullOrEmpty(str: string): Boolean;

    isEmail(email: string): Boolean
}

declare interface IGuid {
    new(): string;

    create(): string;

    isEmpty(guid: string): Boolean
}

declare interface IPersianDate {
    current(): string;
    getDate(date: Date);
}

declare class ValidationException {
    constructor(errors: string[])
}

declare class ValidationSingleException {
    constructor(message: string)
}

declare class NotFoundException {

}


declare interface IState {
    branchId: string;
    fiscalPeriodId: string;
    user: IUser;
    request: Request
}

declare interface IUser {
    id: string;
    name: string;
    email: string;
}

declare interface Builder {
    toDirectResult(): any
}

declare interface ITokenGenerator {
    generate128Bit(): string,
    generate256Bit(): string
}