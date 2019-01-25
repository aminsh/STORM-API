import * as Enumerable from 'linq';
import IEnumerable = Enumerable.IEnumerable;

declare global {
    interface Array<T> {
        asEnumerable(): IEnumerable<T>;
    }
}

Array.prototype.asEnumerable = function () {
    return Enumerable.from(this);
};