"use strict";

module.exports = {
    date(value) {

        if (!value) return null;

        var date = value.toString();

        var year = date.substring(0, 2);
        var month = date.substring(2, 4);
        var day = date.substring(4);

        return `13${year}/${month}/${day}`;
    },
    idGenerator(items){
        items.reduce((pre, item)=> {
            item.id = ++pre;
            return pre;
        },0);
    }
}
