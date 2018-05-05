import {inject, injectable} from "inversify";
import {TreasuryRepository} from "../data/repository.treasury";
import {DetailAccountRepository} from "../data/repository.detailAccount";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class TreasuryTransferDomainService {

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
            journalId: cmd.journalId
        }
    }

    _validate(entity) {

        let errors = [],
            source = this.detailAccountRepository.findById(entity.sourceDetailAccountId),
            destination = this.detailAccountRepository.findById(entity.destinationDetailAccountId);

        if (!source)
            errors.push('مبدا دارای حساب تفصیل نیست');

        if (!destination)
            errors.push('مقصد دارای حساب تفصیل نیست');

        if (!entity.amount || entity.amount <= 0)
            errors.push('مبلغ دریافت شده نباید خالی باشد.');

        if (Utility.String.isNullOrEmpty(entity.transferDate))
            errors.push('تاریخ تحویل نباید خالی باشد.');

        if (entity.sourceDetailAccountId === entity.destinationDetailAccountId)
            errors.push('حساب مبدا و مقصد نمی تواند یکسان باشد.');

        return errors;

    }

    create(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.treasuryType = 'transfer';
        entity.documentType = 'transfer';

        entity = this.treasuryRepository.create(entity);

        this.eventBus.send('onTransferCreated', entity.id);

        return entity.id;
    }

    update(id, cmd) {
        let entity = this.mapToEntity(cmd),
            persistedTreasury = this.treasuryRepository.findById(id),
            errors = this._validate(entity),
            journalId = entity.journalId;

        if (persistedTreasury.journalId)
            errors.push('برای انتقال وجه سند صادر شده است و امکان ویرایش وجود ندارد!');

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.treasuryRepository.update(id, entity);
    }

    remove(id) {
        let persistedTreasury = this.treasuryRepository.findById(id);

        this.treasuryRepository.remove(id);

        this.eventBus.send('onRemoveTreasuryJournal', persistedTreasury.journalId);
    }


    setJournal(id, journalId) {
        let persistedTreasury = this.treasuryRepository.findById(id),
            entity = this.mapToEntity(persistedTreasury);

        entity.journalId = journalId;

        return this.treasuryRepository.update(id, entity);
    }
}