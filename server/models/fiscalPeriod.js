"use strict";

let ModelBase = require('../utilities/modelBase');

class FiscalPeriod extends ModelBase {
    get minDate() {
        return 'STRING';
    }
    get maxDate() {
        return 'STRING';
    }
    get isClosed() {
        return 'BOOLEAN';
    }
}

module.exports = FiscalPeriod;
