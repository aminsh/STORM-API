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

window.digitToWord = function (str) {
    var delimiter, digit, i, iThree, numbers, part, parts, result, resultThree, three;
    if (!isFinite(str)) {
        return '';
    }
    if (typeof str !== "string") {
        str = str.toString();
    }
    parts = ['', 'هزار', 'میلیون', 'میلیارد', 'هزار میلیارد', 'کوادریلیون', 'کویینتیلیون', 'سکستیلیون'];
    numbers = {
        0: ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'],
        1: ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'],
        2: ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'],
        two: ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'],
        zero: 'صفر'
    };
    delimiter = ' و ';
    str = str.split('').reverse().join('').replace(/\d{3}(?=\d)/g, "$&,").split('').reverse().join('').split(',').map(function (str) {
        return Array(4 - str.length).join('0') + str;
    });
    result = (function () {
        var results;
        results = [];
        for (iThree in str) {
            three = str[iThree];
            resultThree = (function () {
                var j, len, results1;
                results1 = [];
                for (i = j = 0, len = three.length; j < len; i = ++j) {
                    digit = three[i];
                    if (i === 1 && digit === '1') {
                        results1.push(numbers.two[three[2]]);
                    } else if ((i !== 2 || three[1] !== '1') && numbers[i][digit] !== '') {
                        results1.push(numbers[i][digit]);
                    } else {
                        continue;
                    }
                }
                return results1;
            })();
            resultThree = resultThree.join(delimiter);
            part = resultThree.length > 0 ? ' ' + parts[str.length - iThree - 1] : '';
            results.push(resultThree + part);
        }
        return results;
    })();
    result = result.filter(function (x) {
        return x.trim() !== '';
    });
    result = result.join(delimiter).trim();
    if (result !== '') {
        return result;
    } else {
        return numbers.zero;
    }
};