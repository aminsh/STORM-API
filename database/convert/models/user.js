"use strict";

const Base = require('./base'),
    Guid = require('../../../server/utilities/guidService');

class User extends Base {
    constructor(model) {
        super();
        
        this.id = Guid.newGuid();
        this.name = model.USname;
        this.oldUsername = model.USid;
    }
}

module.exports = User;