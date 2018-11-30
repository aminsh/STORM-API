"use strict";

exports.up = function(knex, Promise) {

    return knex.schema.table('settings', table => {
        table.boolean('canRemoveJournalWhenSourceRemoved');
    });
};

exports.down = function(knex, Promise) {

    return knex.schema.table('settings', table => {
        table.dropColumn('canRemoveJournalWhenSourceRemoved');
    })
};
