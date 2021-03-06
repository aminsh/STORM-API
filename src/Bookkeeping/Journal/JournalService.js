import { inject, injectable } from "inversify";

const PersianDate = Utility.PersianDate;

@injectable()
export class JournalService {

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

    /** @type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    /** @type {IState}*/
    @inject("State") state = undefined;

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

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
            let subsidiaryLedgerAccount = this.subsidiaryLedgerAccountRepository
                    .findById(line.subsidiaryLedgerAccountId),

                detailAccount = Utility.String.isNullOrEmpty(line.detailAccountId)
                    ? null
                    : this.detailAccountRepository.findById(line.detailAccountId);

            if (!detailAccount && subsidiaryLedgerAccount.hasDetailAccount)
                errors.push('تفصیل مقدار ندارد یا معتبر نیست');

            let dimension1 = Utility.String.isNullOrEmpty(line.dimension1Id)
                ? null
                : this.detailAccountRepository.findById(line.dimension1Id);

            if (!dimension1 && subsidiaryLedgerAccount.hasDimension1)
                errors.push('سطح چهارم مقدار ندارد یا معتبر نیست');

            let dimension2 = Utility.String.isNullOrEmpty(line.dimension2Id)
                ? null
                : this.detailAccountRepository.findById(line.dimension2Id);

            if (!dimension2 && subsidiaryLedgerAccount.hasDimension2)
                errors.push('سطح پنجم مقدار ندارد یا معتبر نیست');

            let dimension3 = Utility.String.isNullOrEmpty(line.dimension3Id)
                ? null
                : this.detailAccountRepository.findById(line.dimension3Id);

            if (!dimension3 && subsidiaryLedgerAccount.hasDimension3)
                errors.push('سطح ششم مقدار ندارد یا معتبر نیست');
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

        let currentFiscalPeriod = this.fiscalPeriodRepository.findById(this.state.fiscalPeriodId);

        if (currentFiscalPeriod.isClosed)
            currentFiscalPeriod = this.fiscalPeriodRepository.findFirstOpen();

        let maxNumber = this.journalRepository.maxTemporaryNumber(currentFiscalPeriod.id).max || 0;

        const date = cmd.date || cmd.temporaryDate;

        let trueDate =
            date &&
            date >= currentFiscalPeriod.minDate &&
            date <= currentFiscalPeriod.maxDate
                ? date
                : PersianDate.current();

        let journal = {
                issuer: cmd.issuer,
                periodId: currentFiscalPeriod.id,
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
                        row: item.row,
                        generalLedgerAccountId: subsidiaryLedgerAccount.generalLedgerAccountId,
                        subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
                        detailAccountId: subsidiaryLedgerAccount.hasDetailAccount ? item.detailAccountId : null,
                        dimension1Id: subsidiaryLedgerAccount.hasDimension1 ? item.dimension1Id : null,
                        dimension2Id: subsidiaryLedgerAccount.hasDimension2 ? item.dimension2Id : null,
                        dimension3Id: subsidiaryLedgerAccount.hasDimension3 ? item.dimension3Id : null,
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

        let existentJournal = this.journalRepository.findById(id),
            errors = this._validate(cmd);

        existentJournal.journalStatus === 'Fixed' &&
        errors.push('سند با شماره {0} ثبت قطعی شده است و قابل ویرایش نمی باشد!'.format(existentJournal.temporaryNumber));


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
            journalType: cmd.journalType,
            journalLines: cmd.journalLines.asEnumerable()
                .select(item => {

                    const subsidiaryLedgerAccount = this.subsidiaryLedgerAccountRepository
                        .findById(item.subsidiaryLedgerAccountId);

                    return {
                        id: item.id,
                        row: item.row,
                        generalLedgerAccountId: subsidiaryLedgerAccount.generalLedgerAccountId,
                        subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
                        detailAccountId: subsidiaryLedgerAccount.hasDetailAccount ? item.detailAccountId : null,
                        dimension1Id: subsidiaryLedgerAccount.hasDimension1 ? item.dimension1Id : null,
                        dimension2Id: subsidiaryLedgerAccount.hasDimension2 ? item.dimension2Id : null,
                        dimension3Id: subsidiaryLedgerAccount.hasDimension3 ? item.dimension3Id : null,
                        article: item.article,
                        debtor: item.debtor,
                        creditor: item.creditor
                    }
                })
                .toArray()

        };

        this.journalRepository.batchUpdate(id, journal);
        return id;
    }

    changeDate(id, date) {
        this.journalRepository.update({ id, temporaryDate: date });
    }

    orderingTemporaryNumberByTemporaryDate() {
        this.journalRepository.orderingTemporaryNumberByTemporaryDate(this.state.fiscalPeriodId);
    }

    clone(id) {
        let sourceJournal = this.journalRepository.findById(id);

        if (!sourceJournal)
            throw new ValidationException([ 'سند وجود ندارد' ]);


        delete sourceJournal.id;

        sourceJournal.journalLines.forEach(e => delete e.id);

        return this.create(sourceJournal);
    }

    merge(dto) {

        let errors = [];

        if (!( dto.ids && dto.ids.length > 0 ))
            errors.push('اسناد وجود ندارد');

        if (errors.length > 0)
            throw new ValidationException(errors);

        const journals = dto.ids.map(id => this.journalRepository.findById(id));

        errors = journals.asEnumerable()
            .selectMany(journal => this._validateForRemove(journal))
            .toArray();

        if (errors.length > 0)
            throw new ValidationException(errors);

        let entity = {
            description: dto.shouldConcatDescriptions
                ? journals.map(item => item.description || '').join(' ')
                : dto.description,
            date: dto.date,
            journalLines: journals
                .asEnumerable()
                .selectMany(item => item.journalLines.asEnumerable().orderBy(l => l.row).toArray())
                .toArray()
        };

        let row = 0;
        entity.journalLines.forEach(item => item.row = ++row);

        const id = this.create(entity);

        dto.ids.forEach(id => this.remove(id));

        return id;
    }

    fix(id) {
        let journal = this.journalRepository.findById(id);

        if (journal.journalStatus === 'Fixed')
            throw new ValidationException([ 'سند قبلا قطعی شده' ]);

        this.journalRepository.update({ id: journal.id, journalStatus: 'Fixed' });
    }

    bookkeeping(id) {
        let journal = this.journalRepository.findById(id);

        if (journal.journalStatus === 'Fixed')
            throw new ValidationException([ 'سند قبلا قطعی شده' ]);

        this.journalRepository.update({ id: journal.id, journalStatus: 'BookKeeped' });
    }

    attachImage(id, attachmentFileName) {
        this.journalRepository.update({ id, attachmentFileName });
    }

    _validateForRemove(journal) {

        let errors = [];

        if (journal.journalStatus === 'Fixed')
            errors.push('سند قطعی شده ، امکان حذف وجود ندارد');

        if (this.fiscalPeriodRepository.findById(this.state.fiscalPeriodId).isClosed)
            errors.push('دوره مالی بسته شده ، امکان حذف وجود ندارد');

        /*if (this.invoiceRepository.isExitsJournal(journal.id))
            errors.push('این سند برای فاکتور صادر شده ، امکان حذف وجود ندارد');

        if (this.inventoryRepository.isExitsJournal(journal.id))
            errors.push('این سند برای اسناد انباری صادر شده ، امکان حذف وجود ندارد');*/

        if (this.treasuryRepository.isExitsJournal(journal.id))
            errors.push('این سند برای اسناد خزانه داری صادر شده ، امکان حذف وجود ندارد');

        return errors;
    }

    remove(id) {
        let journal = this.journalRepository.findById(id),
            errors = this._validateForRemove(journal);

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.journalRepository.remove(id);

        this.eventBus.send('JournalRemoved', journal);
    }
}
