var translates = require('../config/translate.fa.json');
var client = require('../config/translate.fa.json');
var _ = require('lodash');

function translate(key) {
    var trans = _.assign(translates, client);
    var value = trans[key];

    return value ? value : key;
}

module.exports = translate;