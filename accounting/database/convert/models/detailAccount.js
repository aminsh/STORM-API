"use strict";

const Base = require('./base');

class DetailAccount extends Base{
    constructor(model){
        super();
        
        this.code = model.code3;
        this.title = model.title;
        this.isActive = true;
    }
}

module.exports = DetailAccount;