"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve');

const templateSale = require('../config/defaultJournalGenerationTemplates/sale.json'),
    templatePurchase = require('../config/defaultJournalGenerationTemplates/purchase.json'),
    templateReturnSale = require('../config/defaultJournalGenerationTemplates/returnSale.json'),
    templateInventoryOutputSale = require('../config/defaultJournalGenerationTemplates/inventoryOutputSale.json'),
    templateInventoryInputReturnSale = require('../config/defaultJournalGenerationTemplates/inventoryInputReturnSale.json'),
    templateReturnPurchase = require('../config/defaultJournalGenerationTemplates/returnPurchase'),

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



