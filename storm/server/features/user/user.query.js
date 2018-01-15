"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    kendoQueryResolve = require('../../../../accounting/server/services/kendoQueryResolve'),
    connectedUsers = require('./connectedUsers');

class UserQuery {
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

    getById(id) {
        return await(knex.select('id', 'name', 'email', 'image', 'state', 'role')
            .from('users')
            .where('id', id)
            .first());
    }

    getByToken(token) {
        return await(knex.select('id', 'name', 'email', 'image', 'state', 'role')
            .from('users')
            .where('token', token)
            .first());
    }

    getByEmail(email) {
        return knex.table('users')
            .where('email', 'ILIKE', email)
            .first();
    }

    getAllConnectedUsers() {
        return knex.select('id', 'name', 'email', 'image', 'state')
            .from('users')
            .whereIn('id', connectedUsers.users.asEnumerable().select(u => u.userId).toArray());
    }

    total() {
        return knex.from('users').count('*').first();
    }
}

module.exports =  UserQuery;