"use strict";

const FiscalPeriodQuery = require('../accounting/server/queries/query.fiscalPeriod');

module.exports = function (req) {

    let fiscalPeriodId = req.body.fiscalPeriodId || req.query.fiscalPeriodId,
        fiscalPeriodQuery = new FiscalPeriodQuery(req.branchId);


    if (!fiscalPeriodId) {
        setFiscalPeriodId();
    } else{
        let isFiscalPeriodValid = fiscalPeriodQuery.getById(fiscalPeriodId);

        if(isFiscalPeriodValid)
            req.fiscalPeriodId = fiscalPeriodId;

        else setFiscalPeriodId();
    }

    function setFiscalPeriodId() {
        let maxId = fiscalPeriodQuery.getMaxId();
        maxId = maxId || 0;

        req.fiscalPeriodId = maxId;
    }
};