"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    String = require('../utilities/string'),
    Guid = require('../services/shared').utility.Guid,
    translate = require('../services/translateService'),
    InvoiceRepository = require('../data/repository.invoice'),
    ProductRepository = require('../data/repository.product');


module.exports = class SaleDomain {
    constructor(branchId) {
        this.branchId = branchId;
        this.invoiceRepository = new InvoiceRepository(branchId);
    }

    create(cmd) {
        let entity = {
            date: cmd.date,
            description: cmd.description,
            detailAccountId: cmd.detailAccountId,
            invoiceType: 'sale',
            invoiceStatus: cmd.status,
            orderId: cmd.orderId
        };

        if (cmd.number && cmd.number != 0 && !await(this.invoiceRepository.findByNumber(cmd.number, 'sale')))
            entity.number = cmd.number;
        else
            entity.number = (await(this.invoiceRepository.saleMaxNumber()).max || 0) + 1;

        entity.invoiceLines = cmd.invoiceLines.asEnumerable()
            .select(line => ({
                productId: line.productId,
                description: line.description,
                quantity: line.quantity,
                unitPrice: line.unitPrice,
                discount: line.discount || 0,
                vat: line.vat || 0
            }))
            .toArray();

        let result = await(this.invoiceRepository.create(entity));

        return result;
    }

    isInvoiceNumberDuplicated(number, id){
        return this.invoiceRepository.findByNumber(number, 'sale', id);
    }
};