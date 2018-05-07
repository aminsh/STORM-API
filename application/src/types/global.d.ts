declare global {
    const EventEmitter: IEventEmitter,
        Utility: IUtility,
        ValidationException: ValidationException,
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
    delay(milliseconds: number): void;
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

declare interface IState {
    branchId: string;
    fiscalPeriodId: string;
    user: IUser;
    transaction: any
}

declare interface IUser {
    id: string;
    name: string;
    email: string;
}

declare interface Builder {
    toDirectResult(): any
}