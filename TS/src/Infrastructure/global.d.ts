import IEnumerable = Enumerable.IEnumerable;

interface Utility {
    ifUndefined<T>(obj: any, replacement: T): T;

    String: IString
    Guid: IGuid
    PersianDate: IPersianDate;
}

declare interface IPersianDate {
    current(): string;

    getDate(date: Date);
}

declare const Utility: Utility;
declare const ValidationException: ValidationExceptionConstructor;
declare const ValidationSingleException: ValidationSingleExceptionConstructor;
declare const NotFoundException: NotFoundExceptionConstructor;
declare const ForbiddenException: ForbiddenExceptionConstructor;

declare namespace NodeJS {

    interface Global {
        Utility: Utility
    }
}

interface ValidationExceptionConstructor {
    new(errors: string[]): any;
}

interface ValidationSingleExceptionConstructor {
    new(message: string)
}

interface ForbiddenExceptionConstructor {
    new(message: string)
}

interface NotFoundExceptionConstructor {
    new(): any;
}

interface IString {
    isNullOrEmpty(str: string): Boolean;

    isEmail(email: string): Boolean
}

interface IGuid {
    create(): string
}

interface Array<T> {
    asEnumerable(): IEnumerable<T>;
}


