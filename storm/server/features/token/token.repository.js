"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = instanceOf('utility').Guid,
    md5 = require('md5');


module.exports = class {

    constructor() {
        this.create = async(this.create);
    }

    // [START] SMRSAN
    create(token) {
        if (!token.id)
            token.id = Guid.new();

        await(knex('tokens').insert(token));
        return token;

    }

    update(id, token) {

        return knex('tokens').where('id', id).update(token);

    }

    getById(id) {

        return knex('tokens').where('id', id).first();

    }

    getByUserId(userId) {

        return knex('tokens').where('userId', userId).first();

    }

    deleteGenerated(userId, type) {

        return knex('tokens').where('userId', userId).andWhere('type', type).del();

    }

    // [-END-] SMRSAN

};