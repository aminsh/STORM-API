"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    PersianDate = instanceOf('utility').PersianDate,
    Guid = instanceOf('utility').Guid,
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
        this.subsidiaryLedgerAccountService = new SubsidiaryLedgerAccountService(branchId);
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
                        id: item.id,
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

    createJournalLine(cmd){

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

    generatePaymentForInvoice(payments, invoiceId) {

        let invoice,
            subLedger = this.subsidiaryLedgerAccountService;

        if (invoiceId)
            invoice  = await(new InvoiceRepository(this.branchId).findById(invoiceId));

        let description = invoice
            ? `دریافت بابت فاکتور فروش شماره ${invoice.number}`
            : 'دریافت وجه',

            receivableAccount = this.subsidiaryLedgerAccountService.receivableAccount(),
            journalLines = [];

        payments.forEach(p => {
            let article = getArticle(p);

            /* معین حسابهای دریافتنی بستانکار میشود */
            journalLines.push({
                generalLedgerAccountId: receivableAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: receivableAccount.id,
                detailAccountId: invoice.detailAccountId,
                article,
                debtor: 0,
                creditor: p.amount
            });

            let debtorSubLedger = getSubLedgerForDebtor(p),
                id = Guid.new();

            journalLines.push({
                id,
                generalLedgerAccountId: debtorSubLedger.generalLedgerAccountId,
                subsidiaryLedgerAccountId: debtorSubLedger.id,
                detailAccountId: getDetailAccountForDebtor(p),
                article,
                debtor: p.amount,
                creditor: 0
            });

            p.journalLineId = id;
        });


        this.create({description, journalLines});

       return payments;

        function getArticle(p) {
            if (p.paymentType == 'cash')
                return 'دریافت نقدی بابت فاکتور شماره {0}'.format(invoice.number);

            if (p.paymentType == 'receipt')
                return 'دریافت طی فیش / رسید {0} بابت فاکتور شماره {1}'
                    .format(p.number, invoice.number);

            if (p.paymentType == 'cheque')
                return 'دریافت چک به شماره {0} سررسید {1} بانک {2} شعبه {3} بابت فاکتور شماره {4}'
                    .format(p.number, p.date, p.bankName, p.bankBranch, invoice.number);

            if (p.paymentType === 'person')
                return 'دریافت توسط شخص بابت فاکتور شماره {0}'.format(invoice.number);
        }

        function getSubLedgerForDebtor(p) {
            if (p.paymentType === 'cash')
                return subLedger.fundAccount();

            if (p.paymentType === 'receipt')
                return subLedger.bankAccount();

            if (p.paymentType === 'cheque')
                return subLedger.receivableDocument();

            if(p.paymentType === 'person')
                return subLedger.receivableAccount();
        }

        function getDetailAccountForDebtor(p) {
            if (p.paymentType == 'cash')
                return p.fundId;

            if (p.paymentType == 'receipt')
                return p.bankId;

            if (p.paymentType == 'cheque')
                return invoice.detailAccountId;

            if(p.paymentType === 'person')
                return p.personId;
        }
    }
}



module.exports = JournalService;