"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = class PersistedConfigRepository {
    constructor() {
        this.set = async(this.set);
    }

    set(key, value) {
        let config = await(knex.from('config').where('key', key).first());

        if (config)
            return knex('config').where('key', key).update({value});

        return knex('config').insert({key, value});
    }

    get(key){
        return knex.from('config').where('key', key).first();
    }
};