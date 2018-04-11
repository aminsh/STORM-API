import {inject, injectable} from "inversify";

const PersianDate = Utility.PersianDate,
    Guid = Utility.Guid;

@injectable()
export class JournalDomainService {

    /**@type {JournalRepository}*/
    @inject("JournalRepository") journalRepository = undefined;

    /**@type {SettingsRepository}*/
    @inject("SettingsRepository") settingsRepository = undefined;

    /**@type {SubsidiaryLedgerAccountRepository}*/
    @inject("SubsidiaryLedgerAccountRepository") subsidiaryLedgerAccountRepository = undefined;

    /**@type {DetailAccountRepository}*/
    @inject("DetailAccountRepository") detailAccountRepository = undefined;

    /**@type {FiscalPeriodRepository}*/
    @inject("FiscalPeriodRepository") fiscalPeriodRepository = undefined;

    /**@type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type {InventoryRepository}*/
    @inject("InventoryRepository") inventoryRepository = undefined;

    /**@type {JournalGenerationTemplateDomainService}*/
    @inject("JournalGenerationTemplateDomainService") journalGenerationTemplateDomainService = undefined;

    /** @type {SubsidiaryLedgerAccountDomainService}*/
    @inject("SubsidiaryLedgerAccountDomainService") subsidiaryLedgerAccountDomainService = undefined;

    /** @type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    /** @type {IState}*/
    @inject("State") state = undefined;

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

        let errors = [];

        if (Utility.String.isNullOrEmpty(line.article))
            errors.push('شرح آرتیکل مقدار ندارد');
        else if (line.article.length < 3)
            errors.push('شرح آرتیکل باید حداقل ۳ کاراکتر باشد');

        let subsidiaryLedgerAccount = Utility.String.isNullOrEmpty(line.subsidiaryLedgerAccountId)
            ? null
            : this.subsidiaryLedgerAccountRepository.findById(line.subsidiaryLedgerAccountId);

        if (!subsidiaryLedgerAccount)
            errors.push('حساب معین مقدار ندارد یا صحیح نیست');
        else {

            let detailAccount = Utility.String.isNullOrEmpty(line.detailAccountId)
                ? null
                : this.detailAccountRepository.findById(line.detailAccountId);

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

        let maxNumber = this.journalRepository.maxTemporaryNumber(this.state.fiscalPeriodId).max || 0,
            currentFiscalPeriod = this.fiscalPeriodRepository.findById(this.state.fiscalPeriodId),
            trueDate =
                cmd.temporaryDate &&
                cmd.temporaryDate >= currentFiscalPeriod.minDate &&
                cmd.temporaryDate <= currentFiscalPeriod.maxDate
                    ? cmd.temporaryDate
                    : PersianDate.current();

        let journal = {
                periodId: this.state.fiscalPeriodId,
                journalStatus: 'Temporary',
                temporaryNumber: ++maxNumber,
                temporaryDate: trueDate,
                isInComplete: false,
                createdById: this.state.user.id,
                description: cmd.description,
                attachmentFileName: cmd.attachmentFileName,
                tagId: cmd.tagId
            },
            journalLines = cmd.journalLines.asEnumerable()
                .select(item => {

                    const subsidiaryLedgerAccount = this.subsidiaryLedgerAccountRepository
                        .findById(item.subsidiaryLedgerAccountId);

                    return {
                        id: item.id,
                        generalLedgerAccountId: subsidiaryLedgerAccount.generalLedgerAccountId,
                        subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
                        detailAccountId: item.detailAccountId,
                        article: item.article,
                        debtor: item.debtor,
                        creditor: item.creditor
                    };
                })
                .toArray();

        return this.journalRepository.batchCreate(journalLines, journal);
    }

    update(id, cmd) {
        cmd.id = id;

        let errors = this._validate(cmd);

        if (errors.length > 0)
            throw new ValidationException(errors);

        let currentFiscalPeriod = this.fiscalPeriodRepository.findById(this.state.fiscalPeriodId),
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

                    const subsidiaryLedgerAccount = this.subsidiaryLedgerAccountRepository
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

        return this.journalRepository.batchUpdate(id, journal);
    }

    changeDate(id, date) {
        this.journalRepository.update({id, temporaryDate: date});
    }

    orderingTemporaryNumberByTemporaryDate() {
        this.journalRepository.orderingTemporaryNumberByTemporaryDate(this.state.fiscalPeriodId);
    }

    clone(id) {
        let sourceJournal = this.journalRepository.findById(id);

        if (!sourceJournal)
            throw new ValidationException(['سند وجود ندارد']);


        delete sourceJournal.id;

        sourceJournal.journalLines.forEach(e => delete e.id);

        return this.create(sourceJournal);
    }

    fix(id) {
        let journal = this.journalRepository.findById(id);

        if (journal.journalStatus === 'Fixed')
            throw new ValidationException(['سند قبلا قطعی شده']);

        this.journalRepository.update({id: journal.id, journalStatus: 'Fixed'});
    }

    bookkeeping(id) {
        let journal = this.journalRepository.findById(id);

        if (journal.journalStatus === 'Fixed')
            throw new ValidationException(['سند قبلا قطعی شده']);

        this.journalRepository.update({id: journal.id, journalStatus: 'BookKeeped'});
    }

    attachImage(id, attachmentFileName) {
        this.journalRepository.update({id, attachmentFileName});
    }

    remove(id) {
        let journal = this.journalRepository.findById(id),
            errors = [];

        if (journal.journalStatus === 'Fixed')
            errors.push('سند قطعی شده ، امکان حذف وجود ندارد');

        if (this.fiscalPeriodRepository.findById(this.state.fiscalPeriodId).isClosed)
            errors.push('دوره مالی بسته شده ، امکان حذف وجود ندارد');

        if (this.invoiceRepository.isExitsJournal(id))
            errors.push('این سند برای فاکتور صادر شده ، امکان حذف وجود ندارد');

        if (this.invoiceRepository.isExitsJournal(id))
            errors.push('این سند برای اسناد انباری صادر شده ، امکان حذف وجود ندارد');

        if (this.treasuryRepository.isExitsJournal(id))
            errors.push('این سند برای اسناد خزانه داری صادر شده ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.journalRepository.remove(id);
    }

    generateForInvoice(invoiceId) {

        const settings = this.settingsRepository.get(),
            invoice = this.invoiceRepository.findById(invoiceId);

        if (!invoice)
            throw new ValidationException(['فاکتور وجود ندارد']);

        if (!Utility.String.isNullOrEmpty(invoice.journalId))
            throw new ValidationException(['برای فاکتور {0} قبلا سند حسابداری صادر شده'.format(invoice.number)]);

        const cost = (settings.saleCosts || []).asEnumerable()
                .select(e => ({
                    key: e.key,
                    value: (invoice.costs.asEnumerable().firstOrDefault(p => p.key === e.key) || {value: 0}).value
                }))
                .toObject(item => `cost_${item.key}`, item => item.value),

            charge = (settings.saleCharges || []).asEnumerable()
                .select(e => ({
                    key: e.key,
                    value: (invoice.charges.asEnumerable().firstOrDefault(p => p.key === e.key) || {value: 0}).value
                }))
                .toObject(item => `charge_${item.key}`, item => item.value);

        let lineHaveVat = invoice.invoiceLines.asEnumerable().firstOrDefault(e => e.vat !== 0),
            persistedVat = lineHaveVat
                ? (100 * lineHaveVat.vat) / ((lineHaveVat.quantity * lineHaveVat.unitPrice) - lineHaveVat.discount)
                : 0,

            model = Object.assign({
                number: invoice.number,
                date: invoice.date,
                title: invoice.title,
                amount: invoice.invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
                discount: invoice.invoiceLines.asEnumerable().sum(line => line.discount) + invoice.discount,
                vat: invoice.invoiceLines.asEnumerable().sum(line => line.vat) + (invoice.charges.asEnumerable().sum(e => e.value) * persistedVat / 100),
                customer: invoice.detailAccountId,
                customerCode: invoice.detailAccount.code,
                customerTitle: invoice.detailAccount.title,
                bankReceiptNumber: invoice.bankReceiptNumber || ''
            }, cost, charge),

            journal = this.journalGenerationTemplateDomainService.generate(model, 'sale');

        journal.journalLines = journal.journalLines.asEnumerable()
            .orderByDescending(line => line.debtor)
            .toArray();

        return this.create(journal);
    }

    generateForReturnInvoice(invoiceId) {
        const settings = this.settingsRepository.get(),
            invoice = this.invoiceRepository.findById(invoiceId);

        if (!invoice)
            throw new ValidationException(['فاکتور وجود ندارد']);

        if (!Utility.String.isNullOrEmpty(invoice.journalId))
            throw new ValidationException(['برای فاکتور {0} قبلا سند حسابداری صادر شده'.format(invoice.number)]);

        const charge = (settings.saleCharges || []).asEnumerable()
            .select(e => ({
                key: e.key,
                value: (invoice.charges.asEnumerable().firstOrDefault(p => p.key === e.key) || {value: 0}).value
            }))
            .toObject(item => `charge_${item.key}`, item => item.value);

        let model = Object.assign({
                number: invoice.number,
                date: invoice.date,
                title: invoice.title,
                amount: invoice.invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
                discount: invoice.invoiceLines.asEnumerable().sum(line => line.discount) + invoice.discount,
                vat: invoice.invoiceLines.asEnumerable().sum(line => line.vat),
                customer: invoice.detailAccountId,
                customerCode: invoice.detailAccount.code,
                customerTitle: invoice.detailAccount.title,
            }, charge),

            journal = this.journalGenerationTemplateDomainService.generate(model, 'returnSale');


        return this.create(journal);
    }

    generateForOutputSale(outputId) {

        const output = this.inventoryRepository.findById(outputId);

        if (output.ioType !== 'outputSale')
            throw new ValidationException(['حواله جاری از نوع فروش نیست']);

        if (output.inventoryLines.asEnumerable().any(line => !(line.unitPrice && line.unitPrice > 0)))
            throw new ValidationException(['حواله با مبلغ صفر وجود دارد']);

        if (!Utility.String.isNullOrEmpty(output.journalId))
            throw new ValidationException(['برای حواله {0} قبلا سند حسابداری صادر شده'.format(output.number)]);

        const model = {
                number: output.number,
                date: output.date,
                amount: output.inventoryLines.asEnumerable().sum(line => line.unitPrice * line.quantity)
            },

            journal = this.journalGenerationTemplateDomainService.generate(model, 'inventoryOutputSale');

        return this.create(journal);
    }

    generateInvoiceReceive(payments, invoiceId) {

        let invoice,
            subLedger = this.subsidiaryLedgerAccountDomainService;

        if (!invoiceId)
            throw new Error('invoiceId is empty');

        invoice = this.invoiceRepository.findById(invoiceId);

        if (!invoice)
            throw new ValidationException(['فاکتور وجود ندارد']);

        if (!this.subsidiaryLedgerAccountDomainService.receivableAccount)
            throw new ValidationException(['حسابهای دریافتنی در معین های پیش فرض وجود ندارد']);


        let description = invoice
            ? `دریافت بابت فاکتور فروش شماره ${invoice.number}`
            : 'دریافت وجه',

            receivableAccount = this.subsidiaryLedgerAccountDomainService.receivableAccount,
            journalLines = [];

        payments.forEach(p => {
            let article = getArticle(p),
                errors = checkIsValid(p);

            if (errors.length > 0)
                throw new ValidationException(errors);

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

        function checkIsValid(p) {
            let errors = [];

            if (p.paymentType === 'cash' && !subLedger.fundAccount)
                errors.push('حساب معین صندوق در حسابهای معین پیش فرض تعریف نشده');

            if (p.paymentType === 'receipt' && !subLedger.bankAccount)
                errors.push('حساب معین بانک در حسابهای معین پیش فرض تعریف نشده');

            if (p.paymentType === 'cheque' && !subLedger.receivableDocument)
                errors.push('حساب معین اسناد دریافتنی در حسابهای معین پیش فرض تعریف نشده');

            return [];
        }


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
                return subLedger.fundAccount;

            if (p.paymentType === 'receipt')
                return subLedger.bankAccount;

            if (p.paymentType === 'cheque')
                return subLedger.receivableDocument;

            if (p.paymentType === 'person')
                return subLedger.receivableAccount;
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

    generateInvoicePayment(payments, invoiceId) {
        let invoice,
            subLedger = this.subsidiaryLedgerAccountDomainService;

        if (!invoiceId)
            throw new Error('invoiceId is empty');

        invoice = this.invoiceRepository.findById(invoiceId);

        if (!invoice)
            throw new ValidationException(['فاکتور وجود ندارد']);

        if (!this.subsidiaryLedgerAccountDomainService.receivableAccount)
            throw new ValidationException(['حسابهای دریافتنی در معین های پیش فرض وجود ندارد']);


        let invoiceTypeDisplay = Enums.InvoiceType().getDisplay(invoice.invoiceType),
            description = invoice
                ? 'پرداخت وجه بابت فاکتور {0} شماره {1}'.format(invoiceTypeDisplay, invoice.number)
                : 'پرداخت وجه',

            payableAccount = this.subsidiaryLedgerAccountDomainService.payableAccount,
            journalLines = [];

        if (!payableAccount)
            throw new ValidationException('حسابهای پرداختنی در معین ها پیش فرض تعریف نشده');

        payments.forEach(p => {
            let article = getArticle(p),
                errors = checkIsValid(p);

            if (errors.length > 0)
                throw new ValidationException(errors);

            journalLines.push({
                generalLedgerAccountId: payableAccount.generalLedgerAccountId,
                subsidiaryLedgerAccountId: payableAccount.id,
                detailAccountId: invoice.detailAccountId,
                article,
                debtor: p.amount,
                creditor: 0
            });

            let account = getSubLedger(p),
                id = Guid.new();

            journalLines.push({
                id,
                generalLedgerAccountId: account.generalLedgerAccountId,
                subsidiaryLedgerAccountId: account.id,
                detailAccountId: getDetailAccount(p),
                article,
                debtor: 0,
                creditor: p.amount
            });

            p.journalLineId = id;
        });


        this.create({description, journalLines});

        return payments;

        function checkIsValid(p) {
            let errors = [];

            if (p.paymentType === 'cash' && !subLedger.fundAccount)
                errors.push('حساب معین صندوق در حسابهای معین پیش فرض تعریف نشده');

            if (p.paymentType === 'receipt' && !subLedger.bankAccount)
                errors.push('حساب معین بانک در حسابهای معین پیش فرض تعریف نشده');

            if (p.paymentType === 'cheque' && !subLedger.payableDocument)
                errors.push('حساب معین اسناد پرداختنی در حسابهای معین پیش فرض تعریف نشده');

            return [];
        }


        function getArticle(p) {
            if (p.paymentType === 'cash')
                return 'پرداخت نقدی';

            if (p.paymentType === 'receipt')
                return 'پرداخت طی فیش / رسید';

            if (p.paymentType === 'cheque')
                return 'دریافت چک به شماره {0} سررسید {1} بانک {2} شعبه {3}'
                    .format(p.number, p.date, p.bankName, p.bankBranch);

            if (p.paymentType === 'person')
                return 'دریافت توسط شخص';
        }

        function getSubLedger(p) {
            if (p.paymentType === 'cash')
                return subLedger.fundAccount;

            if (p.paymentType === 'receipt')
                return subLedger.bankAccount;

            if (p.paymentType === 'cheque')
                return subLedger.payableDocument;

            if (p.paymentType === 'person')
                return subLedger.payableAccount;
        }

        function getDetailAccount(p) {
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

    generateForPurchase(invoiceId) {
        const settings = this.settingsRepository.get(),
            invoice = this.invoiceRepository.findById(invoiceId);

        if (!invoice)
            throw new ValidationException(['فاکتور وجود ندارد']);

        if (!Utility.String.isNullOrEmpty(invoice.journalId))
            throw new ValidationException(['برای فاکتور {0} قبلا سند حسابداری صادر شده'.format(invoice.number)]);

        const charge = (settings.saleCharges || []).asEnumerable()
            .select(e => ({
                key: e.key,
                value: (invoice.charges.asEnumerable().firstOrDefault(p => p.key === e.key) || {value: 0}).value
            }))
            .toObject(item => `charge_${item.key}`, item => item.value);

        let model = Object.assign({
                number: invoice.number,
                date: invoice.date,
                title: invoice.title,
                amount: invoice.invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
                discount: invoice.invoiceLines.asEnumerable().sum(line => line.discount) + invoice.discount,
                vat: invoice.invoiceLines.asEnumerable().sum(line => line.vat),
                vendor: invoice.detailAccountId,
                vendorCode: invoice.detailAccount.code,
                vendorTitle: invoice.detailAccount.title,
            }, charge),

            journal = this.journalGenerationTemplateDomainService.generate(model, 'purchase');

        return this.create(journal);
    }

    generateForReturnPurchase(invoiceId) {
        const settings = this.settingsRepository.get(),
            invoice = this.invoiceRepository.findById(invoiceId);

        if (!invoice)
            throw new ValidationException(['فاکتور وجود ندارد']);

        if (!Utility.String.isNullOrEmpty(invoice.journalId))
            throw new ValidationException(['برای فاکتور {0} قبلا سند حسابداری صادر شده'.format(invoice.number)]);

        const charge = (settings.saleCharges || []).asEnumerable()
            .select(e => ({
                key: e.key,
                value: (invoice.charges.asEnumerable().firstOrDefault(p => p.key === e.key) || {value: 0}).value
            }))
            .toObject(item => `charge_${item.key}`, item => item.value);

        let model = Object.assign({
                number: invoice.number,
                date: invoice.date,
                title: invoice.title,
                amount: invoice.invoiceLines.asEnumerable().sum(line => line.unitPrice * line.quantity),
                discount: invoice.invoiceLines.asEnumerable().sum(line => line.discount) + invoice.discount,
                vat: invoice.invoiceLines.asEnumerable().sum(line => line.vat),
                vendor: invoice.detailAccountId,
                vendorCode: invoice.detailAccount.code,
                vendorTitle: invoice.detailAccount.title,
            }, charge),

            journal = this.journalGenerationTemplateDomainService.generate(model, 'returnPurchase');


        return this.create(journal);
    }

    generateReturnPurchaseInvoiceReceive(payments, invoiceId) {
        let invoice,
            subLedger = this.subsidiaryLedgerAccountDomainService;

        if (!invoiceId)
            throw new Error('invoiceId is empty');

        invoice = this.invoiceRepository.findById(invoiceId);

        if (!invoice)
            throw new ValidationException(['فاکتور وجود ندارد']);

        if (!this.subsidiaryLedgerAccountDomainService.receivableAccount)
            throw new ValidationException(['حسابهای دریافتنی در معین های پیش فرض وجود ندارد']);


        let description = invoice
            ? `دریافت بابت فاکتور برگشت از خرید شماره ${invoice.number}`
            : 'دریافت وجه',

            receivableAccount = this.subsidiaryLedgerAccountDomainService.receivableAccount,
            journalLines = [];

        payments.forEach(p => {
            let article = getArticle(p),
                errors = checkIsValid(p);

            if (errors.length > 0)
                throw new ValidationException(errors);

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

        function checkIsValid(p) {
            let errors = [];

            if (p.paymentType === 'cash' && !subLedger.fundAccount)
                errors.push('حساب معین صندوق در حسابهای معین پیش فرض تعریف نشده');

            if (p.paymentType === 'receipt' && !subLedger.bankAccount)
                errors.push('حساب معین بانک در حسابهای معین پیش فرض تعریف نشده');

            if (p.paymentType === 'cheque' && !subLedger.receivableDocument)
                errors.push('حساب معین اسناد دریافتنی در حسابهای معین پیش فرض تعریف نشده');

            return [];
        }


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
                return subLedger.fundAccount;

            if (p.paymentType === 'receipt')
                return subLedger.bankAccount;

            if (p.paymentType === 'cheque')
                return subLedger.receivableDocument;

            if (p.paymentType === 'person')
                return subLedger.receivableAccount;
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
}
