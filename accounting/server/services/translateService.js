"use strict";

const translates = require('../config/translate.fa.json'),
    client = require('../config/translate.client.fa.json'),
    _ = require('lodash'),
    totalTranslate = _.assign(translates, client);

function translate(key) {
    var value = totalTranslate[key];
    return value ? value : key;
}

module.exports = translate;