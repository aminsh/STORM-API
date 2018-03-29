"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = require('../../shared/enums');

exports.seed = async(function (knex, Promise) {

    let ioTypes = enums.InventoryIOType().data,
        types = ioTypes.map(type => ({
            id: type.key,
            title: type.display,
            type: type.key.startsWith("input") ? 'input' : 'output',
        }));

    await(knex('inventoryIOTypes').insert(types));
});