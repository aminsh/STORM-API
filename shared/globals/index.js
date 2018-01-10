"use strict";

function assign(obj, assignTo) {
    Object.keys(obj).forEach(key => assignTo[key] = obj[key]);
}

const Utility = {
    String: require('../utilities/string'),
    PersianDate: require('../utilities/persianDate'),
    Guid : require('../utilities/guidService')
};

assign(require('./exceptions'), global);

global.Utility = Utility;
global.Enums = require('../enums');
global.EventEmitter = require('../services/eventEmitter');
global.Config = require('../../config/enviroment');