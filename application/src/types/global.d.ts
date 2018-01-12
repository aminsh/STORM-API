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
    Guid: IGuid,
    PersianDate: IPersianDate
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
    current(): string
}

declare class ValidationException {
    constructor(errors: string[])
}

declare interface IState {
    branchId: string;
    fiscalPeriodId: string;
    user: IUser
}

declare interface IUser {
    id: string;
    name: string;
    email: string;
}

declare interface Promise<any> {
    toDirectResult(): any
}

declare interface Builder {
    toDirectResult(): any
}