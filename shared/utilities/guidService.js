"use strict";

module.exports = class {
    static new() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static isEmpty(guid) {
        if (!guid)
            return true;
        if (guid == '')
            return true;

        if(guid == '00000000-0000-0000-0000-000000000000')
            return true;

        return false;
    }
};