import {inject, injectable} from "inversify";
import {TreasuryRepository} from "../data/repository.treasury";
import {DetailAccountRepository} from "../data/repository.detailAccount";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class TreasuryCashDomainService {

    /** @type {DetailAccountRepository}*/
    @inject("DetailAccountRepository") detailAccountRepository = undefined;

    /** @type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    /** @type {JournalDomainService}*/
    @inject("JournalDomainService") journalDomainService = undefined;

    /** @type {TreasuryJournalGenerationDomainService}*/
    @inject("TreasuryJournalGenerationDomainService") treasuryJournalGenerationDomainService = undefined;

    /** @type {TreasuryPurposeRepository}*/
    @inject("TreasuryPurposeRepository") treasuryPurposeRepository = undefined;

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

    mapToEntity(cmd) {
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
            journalId: cmd.journal ? cmd.journal[0].id : cmd.journalId,
            documentDetail: this._documentDetailMapToEntity(cmd.documentDetail)
        }
    }

    _documentDetailMapToEntity(documentDetail) {

        if (!documentDetail)
            return null;

        return {
            id: documentDetail.id,
            transferTo: documentDetail.transferTo,
            transferFrom: documentDetail.transferFrom
        }
    }

    _receiveValidate(entity) {

        let errors = [],
            source = this.detailAccountRepository.findById(entity.sourceDetailAccountId),
            destination = this.detailAccountRepository.findById(entity.destinationDetailAccountId);

        if (!source)
            errors.push('پرداخت کننده دارای حساب تفصیل نیست');

        if (!destination)
            errors.push('صندوق دارای حساب تفصیل نیست');

        if (!entity.amount || entity.amount <= 0)
            errors.push('مبلغ دریافت شده نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.sourceDetailAccountId))
            errors.push('پرداخت کننده نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.transferDate))
            errors.push('تاریخ تحویل نباید خالی باشد.');

        return errors;

    }

    _paymentValidate(entity) {

        let errors = [],
            source = this.detailAccountRepository.findById(entity.sourceDetailAccountId),
            destination = this.detailAccountRepository.findById(entity.destinationDetailAccountId);

        if (!source)
            errors.push('محل پرداخت دارای حساب تفصیل نیست');

        if (!destination)
            errors.push('دریافت کننده دارای حساب تفصیل نیست');

        if (!entity.amount || entity.amount <= 0)
            errors.push('مبلغ پرداخت شده نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.sourceDetailAccountId))
            errors.push('محل پرداخت نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.transferDate))
            errors.push('تاریخ تحویل نباید خالی باشد.');

        return errors;

    }

    createReceive(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._receiveValidate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.treasuryType = 'receive';
        entity.documentType = 'cash';

        entity = this.treasuryRepository.create(entity);

        this.eventBus.send('onReceiveCashCreated', entity.id);

        return entity.id;
    }

    createPayment(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._paymentValidate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.treasuryType = 'payment';
        entity.documentType = 'cash';

        entity = this.treasuryRepository.create(entity);

        this.eventBus.send('onPaymentCashCreated', entity.id);

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
            errors = persistedTreasury.treasuryType === 'payment'
                ? this._paymentValidate(entity) : this._receiveValidate(entity);

        if (persistedTreasury.journalId)
            errors.push('برای {0} نقدی سند صادر شده است و امکان ویرایش وجود ندارد!'
                .format(Enums.TreasuryType().getDisplay(persistedTreasury.treasuryType)));

        if (errors.length > 0)
            throw new ValidationException(errors);


        this.treasuryRepository.update(id, entity);

    }

    remove(id) {
        let persistedTreasury = this.treasuryRepository.findById(id);

        this.treasuryRepository.remove(id);

        this.eventBus.send('onJournalTreasuryRemove', persistedTreasury.journalId);
        this.eventBus.send('onTreasuryPurposeRemove', persistedTreasury.id);
    }


    setJournal(id, journalId) {
        let persistedTreasury = this.treasuryRepository.findById(id),
            entity = this.mapToEntity(persistedTreasury);

        entity.journalId = journalId;

        return this.treasuryRepository.update(id, entity);
    }
}