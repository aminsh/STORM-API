"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve');

const templateSale = require('../../../application/src/Bookkeeping/json/sale.json'),
    templatePurchase = require('../../../application/src/Bookkeeping/json/purchase.json'),
    templateReturnSale = require('../../../application/src/Bookkeeping/json/returnSale.json'),
    templateInventoryOutputSale = require('../../../application/src/Bookkeeping/json/inventoryOutputSale.json'),
    templateInventoryInputReturnSale = require('../../../application/src/Bookkeeping/json/inventoryInputReturnSale.json'),
    templateReturnPurchase = require('../../../application/src/Bookkeeping/json/returnPurchase'),

    templates = {
        sale: templateSale,
        purchase: templatePurchase,
        returnSale: templateReturnSale,
        inventoryOutputSale: templateInventoryOutputSale,
        inventoryInputReturnSale: templateInventoryInputReturnSale,
        returnPurchase: templateReturnPurchase
    };


class JournalGenerationTemplateQuery extends BaseQuery {
    constructor(branchId, userId) {
        super(branchId, userId);

        this.tableName = 'journalGenerationTemplates'
    }

    getAll(parameters) {
        const query = this.knex.select('id', 'title')
            .from(this.tableName)
            .where('branchId', this.branchId);

        return kendoQueryResolve(query, parameters, item => ({id: item.id, title: item.title}));
    }

    getBySourceType(sourceType) {
        const template = templates[sourceType],
            branchId = this.branchId,

            entity = await(this.knex.select('id', 'title', 'sourceType', 'data')
                .from(this.tableName)
                .where('branchId', branchId)
                .where('sourceType', sourceType)
                .first());


        return entity
            ? {
                id: entity.id,
                title: entity.title,
                fields: template.fields,
                data: entity.data
            }
            : template;
    }
}

module.exports = JournalGenerationTemplateQuery;



