"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.fiscalPeriod'),
    translateService = require('../services/translateService'),
    PersianDate = instanceOf('utility').PersianDate;

class FiscalPeriodQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getMaxId = async(this.getMaxId);
        this.getById = async(this.getById);
    }

    getById(id) {
        let fiscalPeriod = await(this.knex.select('*')
            .from('fiscalPeriods')
            .where('branchId', this.branchId)
            .where('id', id)
            .first());

        return view(fiscalPeriod);
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId;

        let query = knex.select().from(function () {
            this.select(knex.raw('*,\'{0} \' || "minDate" || \' {1} \' || "maxDate" as "display"'
                .format(translateService('From'), translateService('To'))))
                .from('fiscalPeriods')
                .where('branchId', branchId)
                .as('baseFiscalPeriod');
        });

        return kendoQueryResolve(query, parameters, view);
    }

    getMaxId() {

        let currentDate = PersianDate.current();
        let result = await(this.knex.select('id').from('fiscalPeriods')
            .where('branchId', this.branchId)
            .where('isClosed', false)
            .where('minDate','<=',currentDate)
            .orderBy('minDate', 'desc')
            .first());

        return result ? result.id : null;
    }
};

module.exports = FiscalPeriodQuery;