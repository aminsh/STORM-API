"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve');

class InventoryIOTypeQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    get tableName() {
        return "inventoryIOTypes";
    }

    getAll(type, parameters) {
        let branchId = this.branchId,
            tableName = this.tableName,

            query = this.knex.select().from(function () {
                this.select()
                    .from(tableName)
                    .where('branchId', branchId)
                    .orWhereNull('branchId')
                    .as('base');
            })
                .where('type', type);


        return kendoQueryResolve(query, parameters,
            item => ({id: item.id, title: item.title, readOnly: !item.branchId}));
    }
}

module.exports = InventoryIOTypeQuery;