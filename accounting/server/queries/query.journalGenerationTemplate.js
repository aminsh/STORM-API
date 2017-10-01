"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve');

const templateSale = require('../config/defaultJournalGenerationTemplates/sale.json'),
    templateReturnSale = require('../config/defaultJournalGenerationTemplates/returnSale.json'),
    templateInventoryOutputSale = require('../config/defaultJournalGenerationTemplates/inventoryOutputSale.json'),
    templateInventoryInputReturnSale = require('../config/defaultJournalGenerationTemplates/inventoryInputReturnSale.json'),

    templates = {
        sale: templateSale,
        returnSale: templateReturnSale,
        inventoryOutputSale: templateInventoryOutputSale,
        inventoryInputReturnSale: templateInventoryInputReturnSale
    };


class JournalGenerationTemplateQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);

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

            entity = await(this.knex.select('id', 'title', 'sourceType', 'data')
                .from(this.tableName)
                .where('branchId', this.branchId)
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
};

module.exports = JournalGenerationTemplateQuery;



