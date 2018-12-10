"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = require('../../dist/Constants/enums'),
    Uuid = require('uuid-token-generator'),
    uuid = new Uuid,
    idGenerate = () => uuid.generate();

exports.seed = async(function (knex, Promise) {

    await(
        knex.raw(`
            update "journalLines" 
            SET "row" = base."row"
            FROM(
                SELECT "row_number"() OVER(PARTITION BY "journalId") as "row",id FROM "journalLines"
            ) as base
            WHERE "journalLines".id = base.id`)
    );

});

