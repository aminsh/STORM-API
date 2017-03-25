
var Enumerable = require('linqjs');

module.exports = (function () {
    function Collection(collection) {
        this.collection = collection;
    }
    Collection.prototype.asEnumerable = function () {
        return Enumerable.from(this.collection);
    };
    Collection.remove = function (collection, item) {
        var i = collection.indexOf(item);
        collection.splice(i, 1);
        return this;
    };
    Collection.removeAll = function (collection) {
        while (collection.length != 0) {
            collection.shift();
        }
        return collection;
    };
    return Collection;
}());

