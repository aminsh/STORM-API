"use strict";

const moment = require('moment-jalaali'),
    persianDate = {
        current: function () {
            return moment().format('jYYYY/jMM/jDD');
        }
    };

module.exports = persianDate;
