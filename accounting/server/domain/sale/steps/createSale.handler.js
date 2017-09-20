"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = instanceOf('config'),
    utility = instanceOf('utility'),
    PersianDate = utility.PersianDate,
    InvoiceRepository = require('../../../data/repository.invoice'),
    SettingRepository = require('../../../data/repository.setting'),
    DetailAccountDomain = require('../../detailAccount'),
    ProductDomain = require('../../product'),
    SaleDomain = require('../../sale');

class CreateSaleHandler {

    constructor(state, command) {

        this.command = command;
        this.state = state;

        const branchId = state.branchId,
            fiscalPeriodId = state.fiscalPeriodId;

        this.invoiceRepository = new InvoiceRepository(branchId);
        this.detailAccountDomain = new DetailAccountDomain(branchId);
        this.productDomain = new ProductDomain(branchId);
        this.settingsRepository = new SettingRepository(branchId);
        this.saleDomain = new SaleDomain(branchId, fiscalPeriodId);
    }

    run() {

        let cmd = this.command;

        cmd.date = cmd.date || PersianDate.current();
        cmd.detailAccountId = cmd.customer.id;
        cmd.status = (cmd.status === 'confirm' || cmd.status === 'paid')
            ? 'waitForPayment'
            : 'draft';

        let entity = {
            date: cmd.date,
            description: cmd.description,
            detailAccountId: cmd.detailAccountId,
            invoiceType: 'sale',
            invoiceStatus: cmd.status,
            orderId: cmd.orderId
        };

        entity.number = cmd.number || (await(this.invoiceRepository.saleMaxNumber()).max || 0) + 1;

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

        await(this.invoiceRepository.create(entity));

        this.result = {
            id: entity.id,
            printUrl: this.saleDomain.getPrintUrl(entity.id)
        };
    }
}

module.exports = CreateSaleHandler;