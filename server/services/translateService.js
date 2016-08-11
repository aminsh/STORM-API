var translates = require('../config/translate.fa.json');

function translate(key) {
    var value = translates[key];

    return value ? value : key;
}

module.exports = translate;