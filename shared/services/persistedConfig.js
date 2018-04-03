"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

class PersistedConfigSerivce {

    set(key, value) {
        let config = await(knex.from('config').where('key', key).first());

        if (config)
            return knex('config').where('key', key).update({value});

        return await(knex('config').insert({key, value}));
    }

    get(key) {
        return await(knex.from('config').where('key', key).first());
    }
}

module.exports = PersistedConfigSerivce;