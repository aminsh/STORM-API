"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = require('../../dist/Constants/enums'),
    Uuid = require('uuid-token-generator'),
    uuid = new Uuid,
    idGenerate = () => uuid.generate();

exports.seed = async(function (knex, Promise) {

    await(knex('inventories').update({quantityStatus: 'confirmed', priceStatus: 'draft'}));
});

