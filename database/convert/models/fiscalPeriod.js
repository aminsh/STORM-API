"use strict";

const Base = require('./base');

class FiscalPeriod extends Base {
    constructor(year) {
        super();
        
        this.minDate = `13${year}/01/01`;
        this.maxDate = `13${year}/12/30`;
        this.isClosed = false;
    }
}

module.exports = FiscalPeriod;
