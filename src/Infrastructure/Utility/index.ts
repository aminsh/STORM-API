export * from "./Guid";
export * from "./StringUtils";
export const ObjectUtils = {
    ifUndefined<T>(obj: any, replacement: T): T {
        if (typeof obj === 'undefined')
            return replacement;

        return obj;
    }
};

import * as LinqEnumerable from 'linq';
export const Enumerable = LinqEnumerable;

export * from "./PersianDate";
export * from "./NumberUtils";
export * from "./HttpRequest";

