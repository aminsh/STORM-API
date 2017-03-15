"use strict";

const Base = require('./base');

class Bank extends Base{
    constructor(title){
        super();
        
        this.title = title;
    }
}

module.exports = Bank;