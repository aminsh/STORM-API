"use strict";

const knex = require('../../services/knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    kendoQueryResolve = require('../../../../accounting/server/services/kendoQueryResolve');

module.exports = class {
    constructor() {

    }

    getAll(parameters) {
        let query = knex.from(function () {
                this.select('id', 'name', 'email', 'image', 'state')
                    .from('users')
                    .as('base');
            }),

            view = item => ({
                id: item.id,
                name: item.name,
                email: item.email,
                image: item.image,
                state: item.state
            });

        return kendoQueryResolve(query, parameters, view);
    }

    getByEmail(email) {
        return knex.table('users')
            .where('email', 'ILIKE', email)
            .first();
    }
};