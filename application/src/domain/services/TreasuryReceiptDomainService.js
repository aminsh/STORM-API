import {inject, injectable} from "inversify";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class TreasuryReceiptDomainService {
    /** @type {DetailAccountRepository}*/
    @inject("DetailAccountRepository") detailAccountRepository = undefined;

    /** @type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    /** @type {JournalDomainService}*/
    @inject("JournalDomainService") journalDomainService = undefined;

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

    /** @type {TreasuryJournalGenerationDomainService}*/
    @inject("TreasuryJournalGenerationDomainService") treasuryJournalGenerationDomainService = undefined;

    mapToEntity(cmd) {

        let treasury = cmd.id ? this.treasuryRepository.findById(cmd.id) : null;

        return {
            id: cmd.id,
            transferDate: cmd.transferDate || PersianDate.current(),
            sourceDetailAccountId: cmd.payerId || cmd.sourceDetailAccountId || null,
            destinationDetailAccountId: cmd.receiverId || cmd.destinationDetailAccountId || null,
            amount: cmd.amount,
            imageUrl: JSON.stringify(cmd.imageUrl || []),
            description: cmd.description,
            treasuryType: cmd.treasuryType,
            documentType: cmd.documentType,
            journalId: cmd.journalId,
            documentDetail: this._documentDetailMapToEntity(cmd.documentDetail)

        }
    }

    _documentDetailMapToEntity(documentDetail){

        if(!documentDetail)
            return null;

        return {
            id: documentDetail.id,
            transferTo: documentDetail.transferTo,
            transferFrom: documentDetail.transferFrom,
            number: documentDetail.number,
            date: documentDetail.date,
            bank: documentDetail.bank,
            bankBranch: documentDetail.bankBranch,
            identity: documentDetail.identity,
            trackingNumber: documentDetail.trackingNumber
        }
    }

    _receiveValidate(entity) {

        let errors = [],
            sourceDetailAccount = this.detailAccountRepository.findById(entity.sourceDetailAccountId),
            destinationDetailAccount = this.detailAccountRepository.findById(entity.destinationDetailAccountId);

        if (!sourceDetailAccount)
            errors.push('پرداخت کننده دارای حساب تفصیل نیست');

        if (!destinationDetailAccount)
            errors.push('بانک دریافت کننده دارای حساب تفصیل نیست');

        if (!entity.amount || entity.amount <= 0)
            errors.push('مبلغ دریافت شده نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.sourceDetailAccountId))
            errors.push('پرداخت کننده نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.transferDate))
            errors.push('تاریخ تحویل نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.documentDetail.number))
            errors.push('شماره فیش نباید خالی باشد');


        return errors;

    }

    _paymentValidate(entity) {

        let errors = [],
            sourceDetailAccount = this.detailAccountRepository.findById(entity.sourceDetailAccountId),
            destinationDetailAccount = this.detailAccountRepository.findById(entity.destinationDetailAccountId);

        if (!destinationDetailAccount)
            errors.push('شخص دریافت کننده دارای حساب تفصیل نیست');

        if (!sourceDetailAccount)
            errors.push('پرداخت کننده دارای حساب تفصیل نیست');

        if (!entity.amount || entity.amount <= 0)
            errors.push('مبلغ پرداخت شده نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.destinationDetailAccountId))
            errors.push('دریافت کننده نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.transferDate))
            errors.push('تاریخ تحویل نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.documentDetail.number))
            errors.push('شماره فیش نباید خالی باشد');

        return errors;

    }

    createReceive(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._receiveValidate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.treasuryType = 'receive';
        entity.documentType = 'receipt';

        entity = this.treasuryRepository.create(entity);

        this.eventBus.send('onReceiveReceiptCreated', entity.id);

        return entity.id;
    }

    createPayment(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._paymentValidate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.treasuryType = 'payment';
        entity.documentType = 'receipt';

        entity = this.treasuryRepository.create(entity);

        this.eventBus.send('onPaymentReceiptCreated', entity.id);

        return entity.id;
    }

    create(cmd){
        if (cmd.treasuryType === 'receive')
            return this.createReceive(cmd);

        if (cmd.treasuryType === 'payment')
            return this.createPayment(cmd);
    }

    update(id, cmd) {
        let entity = this.mapToEntity(cmd),
            persistedTreasury = this.treasuryRepository.findById(id),
            errors = persistedTreasury.treasuryType === 'receive' ? this._receiveValidate(entity)
                : this._paymentValidate(entity),
            journalId = entity.journalId;


        if (!persistedTreasury)
            errors.push('{0} وجود ندارد!'.format(Enums.TreasuryPaymentDocumentTypes().getDisplay(entity.documentType)));

        if (persistedTreasury.journalId)
            errors.push('برای واریزی {0} سند صادر شده است و امکان ویرایش وجود ندارد!'
                .format(Enums.TreasuryType().getDisplay(persistedTreasury.treasuryType)));

        if (errors.length > 0)
            throw new ValidationException(errors);

        //entity.journalId = null;
        this.treasuryRepository.update(id, entity);

        /*if (journalId) {
            this.journalDomainService.remove(journalId);

            entity.treasuryType === 'receive' ?
                this.treasuryJournalGenerationDomainService.generateForReceiveReceipt(id) :
                this.treasuryJournalGenerationDomainService.generateForPaymentReceipt(id);
        }*/

    }

    remove(id) {
        let persistedTreasury = this.treasuryRepository.findById(id),
            errors = [];

        if (persistedTreasury.journalId)
            errors.push('برای واریزی {0} سند صادر شده است و امکان حذف وجود ندارد!'
                .format(Enums.TreasuryType().getDisplay(persistedTreasury.treasuryType)));

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.treasuryRepository.remove(id);

        /*if (persistedTreasury.journalId)
            this.journalDomainService.remove(persistedTreasury.journalId);*/
    }

    setJournal(id, journalId) {
        let persistedTreasury = this.treasuryRepository.findById(id),
            entity = this.mapToEntity(persistedTreasury);

        entity.journalId = journalId;

        return this.treasuryRepository.update(id, entity);
    }
}