"use strict";

exports.up = function(knex, Promise) {

    return knex.schema.createTable('users_oauth_profiles', table => {

        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
        table.increments('id').primary();

        table.string('provider');
        table.string('provider_user_id');
        table.string('token', 1000);
        table.json('profile');

        table.string('userId');

        table
            .foreign('userId')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
    })
};

exports.down = function(knex, Promise) {

    return knex.schema.dropTable('users_oauth_profiles');
};
