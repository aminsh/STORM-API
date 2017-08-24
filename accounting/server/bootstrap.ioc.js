"use strict";

module.exports = function (container) {
    container.bind('query.invoice', function (branchId) {
        const InvoiceQuery = require('./queries/query.invoice');
        return new InvoiceQuery(branchId);
    });

    container.bind('repository.payment', function (branchId) {
        const PaymentRepository = require('./data/repository.payment');
        return new PaymentRepository(branchId);
    });

    container.bind('query.fiscalPeriod', function (branchId) {
       const FiscalPeriodQuery = require('./queries/query.fiscalPeriod');
       return new FiscalPeriodQuery(branchId);
    });
};
