var Enumerable = require('linqjs');
Array.prototype.asEnumerable = function () {
    var enumerable = Enumerable.from(this);
    enumerable.remove = remove.bind(this);
    enumerable.removeAll = removeAll.bind(this);
    return enumerable;
};

function remove(item) {
    var i = this.indexOf(item);
    this.splice(i, 1);
}

function removeAll() {
    var self = this;

    while (self.length != 0) {
        self.shift();
    }

    return this;
}

window.isArray = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};


window.Guid = (function () {
    return {
        newGuid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        isEmpty: function () {
            return false;
        }
    }
})();
String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};
window.getKeys = function (obj) {
    var keys = [];
    for (key in obj) {
        keys.push(key);
    }

    return keys;
};

window.isNumeric = function (input) {
    return (input - 0) == input && (input + '').replace(/^\s+|\s+$/g, "").length > 0;
};