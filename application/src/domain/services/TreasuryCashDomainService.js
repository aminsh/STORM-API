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

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

    mapToEntity(cmd) {

        let treasury = cmd.id ? this.treasuryRepository.findById(cmd.id) : null;

        return {
            id: cmd.id,
            transferDate: cmd.transferDate || PersianDate.current(),
            sourceDetailAccountId: cmd.payerId || null,
            destinationDetailAccountId: cmd.receiverId || null,
            amount: cmd.amount,
            imageUrl: JSON.stringify(cmd.imageUrl || []),
            description: cmd.description,
            treasuryType: cmd.treasuryType,
            documentType: cmd.documentType,
            journalId: cmd.journalId,
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

    update(id, cmd) {
        let entity = this.mapToEntity(cmd),
            persistedTreasury = this.treasuryRepository.findById(id),
            errors = persistedTreasury.treasuryType === 'payment'
                ? this._paymentValidate(entity) : this._receiveValidate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        this.treasuryRepository.update(id, entity);
    }

    remove(id) {
        this.treasuryRepository.remove(id);
    }


    setJournal(id, journalId) {
        return this.treasuryRepository.update(id, {journalId});
    }
}