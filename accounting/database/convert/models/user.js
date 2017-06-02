"use strict";

const Base = require('./base'),
    Guid = require('../../../server/services/shared').utility.Guid;

class User extends Base {
    constructor(model) {
        super();


        this.id = model.USid == 'Public'
            ? 'aaa2a686-1cb7-45ab-9660-5e8736ca821f'
            : Guid.new();

        this.name = model.USname;
        this.oldUsername = model.USid;
    }
}

module.exports = User;