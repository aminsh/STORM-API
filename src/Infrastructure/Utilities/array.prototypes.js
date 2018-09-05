import Enumerable from "linq";

Array.prototype.asEnumerable = function () {
    let enumerable = Enumerable.from(this);
    enumerable.remove = remove.bind(this);
    enumerable.removeAll = removeAll.bind(this);
    return enumerable;
};

function remove(item) {
    let i = this.indexOf(item);

    this.splice(i, 1);
}

function removeAll() {
    var self = this;

    while (self.length !== 0) {
        self.shift();
    }

    return this;
}


Object.defineProperty(Array.prototype, 'asEnumerable', {enumerable: false});
