"use strict";

const knex = require('../../services/knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = require('../../services/shared').utility.Guid,
    md5 = require('md5');


module.exports = class {

    constructor(){
        this.create = async(this.create);
    }

    // [START] SMRSAN
    create(token){

        return knex('tokens').insert(token);

    }
    update(id,token){

        return knex('tokens').where('id', id).update(token);

    }
    getById(id){

        return knex('tokens'). where('id', id).first();

    }
    // [-END-] SMRSAN

};