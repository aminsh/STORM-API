"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    config = instanceOf('config'),
    utility = instanceOf('utility'),
    String = utility.String,
    Guid = utility.Guid,
    PersianDate = utility.PersianDate,
    DomainException = instanceOf('domainException'),
    Crypto = instanceOf('Crypto'),
    translate = require('../services/translateService'),
    FiscalPeriodRepository = require('../data/repository.fiscalPeriod'),
    InvoiceRepository = require('../data/repository.invoice'),
    SettingRepository = require('../data/repository.setting'),
    DetailAccountDomain = require('../domain/detailAccount'),
    ProductDomain = require('../domain/product');


class SaleDomain {

    constructor(branchId) {
        this.branchId = branchId;
        this.invoiceRepository = new InvoiceRepository(branchId);
        this.fiscalPeriodRepository = new FiscalPeriodRepository(branchId);
        this.detailAccountDomain = new DetailAccountDomain(branchId);
        this.productDomain = new ProductDomain(branchId);
        this.settingsRepository = new SettingRepository(branchId);
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

        return {
            id: entity.id,
            printUrl: this.getPrintUrl(entity.id)
        };
    }

    isInvoiceNumberDuplicated(number, id) {
        return this.invoiceRepository.findByNumber(number, 'sale', id);
    }

    getPrintUrl(id) {
       return `${config.url.origin}/print/?token=${Crypto.sign({
            branchId: this.branchId,
            id: id,
            reportId: 700
        })}`;
    }
};

module.exports = SaleDomain;