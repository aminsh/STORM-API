"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    PersianDate = instanceOf('utility').PersianDate,
    String = instanceOf('utility').String,
    Guid = instanceOf('utility').Guid,
    JournalRepository = require('./data').JournalRepository,
    SubsidiaryLedgerAccountRepository = require('./data').SubsidiaryLedgerAccountRepository,
    DetailAccountRepository = require('./data').DetailAccountRepository,
    FiscalPeriodRepository = require('./data').FiscalPeriodRepository,
    InvoiceRepository = require('./data').InvoiceRepository,
    InventoryRepository = require('./data').InventoryRepository,
    JournalGenerationTemplateService = require('./journalGenerationTemplate'),
    SubsidiaryLedgerAccountService = require('./subsidiaryLedgerAccount');

class JournalService {

    constructor(branchId, fiscalPeriodId, user) {

        if (!user)
            throw new Error('user is empty');

        this.branchId = branchId;
        this.fiscalPeriodId = fiscalPeriodId;
        this.user = user;

        this.journalRepository = new JournalRepository(branchId);

        this.journalGenerationTemplateService = new JournalGenerationTemplateService(branchId);
        this.subsidiaryLedgerAccountService = new SubsidiaryLedgerAccountService(branchId);
    }

    _validate(cmd) {
        let errors = [];

        const remainder = cmd.journalLines.asEnumerable().sum(item => item.debtor - item.creditor);
        if (remainder !== 0)
            errors.push('جمع بدهکار و بستانکار سند برابر نیست');

        errors = cmd.journalLines.asEnumerable()
            .selectMany(this._validateLine.bind(this))
            .concat(errors)
            .toArray();

        return errors;

    }

    _validateLine(line) {

        let errors = [],
            subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(this.branchId),
            detailAccountRepository = new DetailAccountRepository(this.branchId);

        if (String.isNullOrEmpty(line.article))
            errors.push('شرح آرتیکل مقدار ندارد');
        else if (line.article.length < 3)
            errors.push('شرح آرتیکل باید حداقل ۳ کاراکتر باشد');

        let subsidiaryLedgerAccount = String.isNullOrEmpty(line.subsidiaryLedgerAccountId)
            ? null
            : subsidiaryLedgerAccountRepository.findById(line.subsidiaryLedgerAccountId);

        if (!subsidiaryLedgerAccount)
            errors.push('حساب معین مقدار ندارد یا صحیح نیست');
        else {

            let detailAccount = String.isNullOrEmpty(line.detailAccountId)
                ? null
                : detailAccountRepository.findById(line.detailAccountId);

            if (!detailAccount)
                errors.push('تفصیل مقدار ندارد یا صحیح نیست');
        }

        let debtor = parseFloat(line.debtor),
            creditor = parseFloat(line.creditor);

        if (isNaN(debtor) || isNaN(creditor)) {
            if (isNaN(debtor)) errors.push('مقدار بدهکار صحیح نیست');
            if (isNaN(creditor)) errors.push('مقدار بستانکار صحیح نیست');
        }
        else {
            if (debtor > 0 && creditor > 0)
                errors.push('بدهکار و بستانکار نمیتواند هر دو دارای مقدار باشد')
        }
    }


    create(cmd) {

        let errors = this._validate(cmd);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let maxNumber = this.journalRepository.maxTemporaryNumber(this.fiscalPeriodId).max || 0,
            currentFiscalPeriod = new FiscalPeriodRepository(this.branchId).findById(this.fiscalPeriodId),
            trueDate =
                cmd.temporaryDate &&
                cmd.temporaryDate >= currentFiscalPeriod.minDate &&
                cmd.temporaryDate <= currentFiscalPeriod.maxDate
                    ? cmd.temporaryDate
                    : PersianDate.current();

        let journal = {
                periodId: this.fiscalPeriodId,
                journalStatus: 'Temporary',
                temporaryNumber: ++maxNumber,
                temporaryDate: trueDate,
                isInComplete: false,
                createdById: this.user.id,
                description: cmd.description,
                attachmentFileName: cmd.attachmentFileName,
                tagId: cmd.tagId
            },
            journalLines = cmd.journalLines.asEnumerable()
                .select(item => {

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
                })
                .toArray();

        return this.journalRepository.batchCreate(journalLines, journal);
    }

    update(id, cmd) {
        cmd.id = id;

        let errors = this._validate(cmd);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let currentFiscalPeriod = new FiscalPeriodRepository(this.branchId).findById(this.fiscalPeriodId),
            trueDate =
                cmd.temporaryDate &&
                cmd.temporaryDate >= currentFiscalPeriod.minDate &&
                cmd.temporaryDate <= currentFiscalPeriod.maxDate
                    ? cmd.temporaryDate
                    : PersianDate.current();

        let journal = {
            temporaryDate: trueDate,
            isInComplete: false,
            description: cmd.description,
            attachmentFileName: cmd.attachmentFileName,
            tagId: cmd.tagId,
            journalLines: cmd.journalLines.asEnumerable()
                .select(item => {

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
                })
                .toArray()
        };

        return this.journalRepository.batchUpdate(journal);
    }

    clone(id){
        let sourceJournal = this.journalRepository.findById(id);

        if(!sourceJournal)
            throw new ValidationException(['سند وجود ندارد']);

        return this.create(sourceJournal);
    }

    fix(id){
        let journal = this.journalRepository.findById(id);

        if(journal.journalStatus === 'Fixed')
            throw new ValidationException(['سند قبلا قطعی شده']);

        this.journalRepository.update({id: journal.id, journalStatus: 'Fixed'});
    }

    bookkeeping(id){
        let journal = this.journalRepository.findById(id);

        if(journal.journalStatus === 'Fixed')
            throw new ValidationException(['سند قبلا قطعی شده']);

        this.journalRepository.update({id: journal.id, journalStatus: 'BookKeeped'});
    }

    attachImage(id, attachmentFileName){
        this.journalRepository.update({id, attachmentFileName});
    }

    remove(id){
        let journal = this.journalRepository.findById(id);

        if(journal.journalStatus === 'Fixed')
            throw new ValidationException(['سند قطعی شده ، امکان حذف وجود ندارد']);

        if(new FiscalPeriodRepository(this.branchId).findById(this.fiscalPeriodId).isClosed)
            throw new ValidationException(['دوره مالی بسته شده ، امکان حذف وجود ندارد']);

        if(new InvoiceRepository(this.branchId).isExitsJournal(id))
            throw new ValidationException(['این سند برای فاکتور صادر شده ، امکان حذف وجود ندارد']);

        if(new InventoryRepository(this.branchId).isExitsJournal(id))
            throw new ValidationException(['این سند برای اسناد انباری صادر شده ، امکان حذف وجود ندارد']);

        this.journalRepository.update({id: journal.id, journalStatus: 'Fixed'});
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

    generateForOutputSale(outputId) {

        const output = new InventoryRepository(this.branchId).findById(outputId),

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
            invoice = new InvoiceRepository(this.branchId).findById(invoiceId);

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

            if (p.paymentType === 'person')
                return subLedger.receivableAccount();
        }

        function getDetailAccountForDebtor(p) {
            if (p.paymentType == 'cash')
                return p.fundId;

            if (p.paymentType == 'receipt')
                return p.bankId;

            if (p.paymentType == 'cheque')
                return invoice.detailAccountId;

            if (p.paymentType === 'person')
                return p.personId;
        }
    }

    generateForPurchase(invoicePurchaseId) {
        let purchase = new InvoiceRepository(this.branchId).findById(invoicePurchaseId),
            journal = {
                description: 'بابت فاکتور خرید شماره {0}'.format(purchase.number)
            },

            invoiceLines = purchase.invoiceLines,
            sumAmount = invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
            sumDiscount = invoiceLines.asEnumerable().sum(line => line.discount),
            sumVat = invoiceLines.asEnumerable().sum(line => line.vat),

            payableAccount = await(this.subsidiaryLedgerAccountService.payableAccount()),
            purchaseAccount = await(this.subsidiaryLedgerAccountService.purchaseAccount()),

            journalLines = [
                {
                    generalLedgerAccountId: payableAccount.generalLedgerAccountId,
                    subsidiaryLedgerAccountId: payableAccount.id,
                    detailAccountId: purchase.detailAccountId,
                    debtor: 0,
                    creditor: sumAmount - sumDiscount + sumVat,
                    article: journal.description,
                    row: 3
                }, {
                    generalLedgerAccountId: purchaseAccount.generalLedgerAccountId,
                    subsidiaryLedgerAccountId: purchaseAccount.id,
                    debtor: sumAmount,
                    creditor: 0,
                    article: journal.description,
                    row: 1
                }];

        if (sumDiscount > 0) {
            let discountAccount = await(this.subsidiaryLedgerAccountService.purchaseDiscountAccount());

            journalLines.push({
                generalLedgerAccountId: discountAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: discountAccount.id,
                debtor: 0,
                creditor: sumDiscount,
                article: journal.description,
                row: 4
            });
        }


        if (sumVat > 0) {
            let vatAccount = await(this.subsidiaryLedgerAccountService.purchaseVatAccount());

            journalLines.push({
                generalLedgerAccountId: vatAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: vatAccount.id,
                debtor: sumVat,
                creditor: 0,
                article: journal.description,
                row: 2
            });
        }

        journalLines = journalLines.asEnumerable().orderBy(e => e.row).toArray();
        journalLines.forEach((e, i) => e.row = i + 1);

        journal.journalLines = journalLines;

        return this.create(journal);
    }
}


module.exports = JournalService;