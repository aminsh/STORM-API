var ejs = require('ejs');
var translate = require('../services/translateService');

ejs.filters.translate = translate;


