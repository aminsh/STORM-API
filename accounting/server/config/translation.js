const ejs = require('ejs'),
    translate = require('../services/translateService');

ejs.filters.translate = translate;






