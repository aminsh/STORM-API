"use strict";

const toResult = require('asyncawait/await'),
    Promise = require('promise');


function assign(obj, assignTo) {
    Object.keys(obj).forEach(key => assignTo[key] = obj[key]);
}


const TokenGenerator = require('../services/token.generator'),
    Utility = {
        String: require('../utilities/string'),
        PersianDate: require('../utilities/persianDate'),
        Guid: require('../utilities/guidService'),
        delay: milliseconds => toResult(new Promise(resolve => setTimeout(() => resolve(), milliseconds))),
        TokenGenerator: new TokenGenerator
    };


assign(require('./exceptions'), global);

global.Utility = Utility;
global.Enums = require('../enums');
global.EventEmitter = require('../services/eventEmitter');
global.Config = require('../../config/enviroment');