"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.fiscalPeriod'),
    translateService = require('../services/translateService');

module.exports = class FiscalPeriodQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getMaxId = async(this.getMaxId);
    }

    getAll(parameters) {
        let knex = this.knex;

        let query = knex.select().from(function () {
            this.select(knex.raw('*,\'{0} \' || "minDate" || \' {1} \' || "maxDate" as "display"'
                .format(translateService('From'), translateService('To'))))
                .from('fiscalPeriods')
                .as('baseFiscalPeriod');
        });

        return kendoQueryResolve(query, parameters, view);
    }

    getMaxId() {
        let result = await(this.knex.table('fiscalPeriods').max('id').first());
        return result.max;
    }
};