"use strict";

const Guid = require('../../../shared/utilities/guidService');

module.exports = {
    newGuid(){
        return Guid.new();
    },
    date(value) {

        if (!value) return null;

        var date = value.toString();

        var year = date.substring(0, 2);
        var month = date.substring(2, 4);
        var day = date.substring(4);

        return `13${year}/${month}/${day}`;
    },
    idGenerator(items){

        items.forEach(item => item.id = Guid.new());
        /*items.reduce((pre, item)=> {
            item.id = ++pre;
            return pre;
        },0);*/
    }
};
