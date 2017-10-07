"use strict";

const DomainException = instanceOf('domainException');

module.exports = function (container) {
    container.singleton('translate', function () {
        return require('./services/translateService');
    });

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

    container.bind('service.detailAccount', function (branchId) {
        const DetailAccountService = require('./domain/detailAccount');
        return new DetailAccountService(branchId);
    });

    container.bind('inventory.control', function (branchId, fiscalPeriodId, settings) {
        if (settings.productOutputCreationMethod === 'defaultStock') {
            const DefaultStockInventoryControl = require('./domain/inventory/inventory.control/inventory.control.defaultStock');
            return new DefaultStockInventoryControl(branchId, fiscalPeriodId);
        }

        if (settings.productOutputCreationMethod === 'stockOnRequest') {
            const StockOnRequestInventoryControl = require('./domain/inventory/inventory.control/inventory.control.stockOnRequet');
            return new StockOnRequestInventoryControl(branchId, fiscalPeriodId);
        }

        throw new DomainException(['تنظیمات انبار انجام نشده']);
    });

    container.bind('createOutput', function (branchId, fiscalPeriodId, settings) {
        if (settings.productOutputCreationMethod === 'defaultStock') {
            const DefaultStockHandler = require('./domain/inventory/inventory.createOutput.bySale/defaultStock');
            return new DefaultStockHandler(branchId, fiscalPeriodId);
        }

        if (settings.productOutputCreationMethod === 'stockOnRequest') {
            const StockOnRequestHandler = require('./domain/inventory/inventory.createOutput.bySale/stockOnRequest');
            return new StockOnRequestHandler(branchId, fiscalPeriodId);
        }
    });
};
