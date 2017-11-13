"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    PersianDate = instanceOf('utility').PersianDate,
    JournalRepository = require('./data').JournalRepository,
    SubsidiaryLedgerAccountRepository = require('./data').SubsidiaryLedgerAccountRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    InventoryeRepository = require('./data').InventoryeRepository,
    JournalGenerationTemplateService = require('./journalGenerationTemplate'),
    SubsidiaryLedgerAccountService = require('./subsidiaryLedgerAccount');

class JournalService {
    constructor(branchId, fiscalPeriodId, user) {
        this.branchId = branchId;
        this.fiscalPeriodId = fiscalPeriodId;
        this.user = user;

        this.journalRepository = new JournalRepository(branchId);

        this.journalGenerationTemplateService = new JournalGenerationTemplateService(branchId);
        this.SubsidiaryLedgerAccountService = new SubsidiaryLedgerAccountService(branchId);
    }

    create(cmd) {
        let maxNumber = this.journalRepository.maxTemporaryNumber(this.fiscalPeriodId).max || 0;

        let journal = {
                periodId: this.fiscalPeriodId,
                journalStatus: 'Fixed',
                temporaryNumber: ++maxNumber,
                temporaryDate: PersianDate.current(),
                isInComplete: false,
                createdById: this.user.id,
                description: cmd.description
            },
            journalLines = cmd.journalLines.asEnumerable()
                .select(async.result(item => {

                    const subsidiaryLedgerAccount = new SubsidiaryLedgerAccountRepository(this.branchId)
                        .findById(item.subsidiaryLedgerAccountId);

                    return {
                        generalLedgerAccountId: subsidiaryLedgerAccount.generalLedgerAccountId,
                        subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
                        detailAccountId: item.detailAccountId,
                        article: item.article,
                        debtor: item.debtor,
                        creditor: item.creditor
                    }
                }))
                .toArray();

        return this.journalRepository.batchCreate(journalLines, journal);
    }

    generateForInvoice(invoiceId) {

        const invoice = new InvoiceRepository(this.branchId).findById(invoiceId);

        let model = {
                number: invoice.number,
                date: invoice.date,
                title: invoice.title,
                amount: invoice.invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
                discount: invoice.invoiceLines.asEnumerable().sum(line => line.discount),
                vat: invoice.invoiceLines.asEnumerable().sum(line => line.vat),
                customer: invoice.detailAccountId
            },

            journal = this.journalGenerationTemplateService.generate(model, 'sale');

        return this.create(journal);
    }

    generateForOutputSale(outputIds) {

        return outputIds.asEnumerable()
            .select(id => ({
                id,
                journalId: this._generateForOutputSale(id)
            }))
            .toArray();
    }

    _generateForOutputSale(outputId) {

        const output = new InventoryeRepository(this.branchId).findById(outputId),

            model = {
                number: output.number,
                date: output.date,
                amount: output.inventoryLines.asEnumerable().sum(line => line.unitPrice * line.quantity)
            },

            journal = await(this.journalGenerationTemplateService.generate(model, 'inventoryOutputSale'));

        return this.create(journal);
    }

}

module.exports = JournalService;