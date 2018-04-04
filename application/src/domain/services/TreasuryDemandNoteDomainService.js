import {inject, injectable} from "inversify";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class TreasuryDemandNoteDomainService {
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
            transferFrom: documentDetail.transferFrom,
            number: documentDetail.number,
            dueDate: documentDetail.dueDate,
            issueDate: documentDetail.issueDate,
            totalTreasuryNumber: documentDetail.totalTreasuryNumber,
            paymentLocation: documentDetail.paymentLocation,
            paymentPlace: documentDetail.paymentPlace,
            demandNoteTo: documentDetail.demandNoteTo,
            nationalCode: documentDetail.nationalCode,
            residence: documentDetail.residence
        }
    }

    _receiveValidate(entity) {

        let errors = [],
            sourceDetailAccount = this.detailAccountRepository.findById(entity.sourceDetailAccountId);

        if (!sourceDetailAccount)
            errors.push('پرداخت کننده دارای حساب تفصیل نیست');

        if (!entity.amount || entity.amount <= 0)
            errors.push('مبلغ سفته خالی می باشد.');

        if (Utility.String.isNullOrEmpty(entity.sourceDetailAccountId))
            errors.push('پرداخت کننده خالی می باشد.');

        if (Utility.String.isNullOrEmpty(entity.transferDate))
            errors.push('تاریخ تحویل خالی می باشد.');

        return errors;

    }

    _paymentValidate(entity) {

        let errors = [],
            destinationDetailAccount = this.detailAccountRepository.findById(entity.destinationDetailAccountId);

        if (!destinationDetailAccount)
            errors.push('دریافت کننده دارای حساب تفصیل نیست');

        if (!entity.amount || entity.amount <= 0)
            errors.push('مبلغ سفته خالی می باشد.');

        if (Utility.String.isNullOrEmpty(entity.sourceDetailAccountId))
            errors.push('دریافت کننده خالی می باشد.');

        if (Utility.String.isNullOrEmpty(entity.transferDate))
            errors.push('تاریخ تحویل خالی می باشد.');

        return errors;

    }

    createReceive(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._receiveValidate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.treasuryType = 'receive';
        entity.documentType = 'demandNote';

        entity = this.treasuryRepository.create(entity);

        this.eventBus.send('onReceiveDemandNoteCreated', entity.id);

        return entity.id;
    }

    createPayment(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._paymentValidate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        entity.treasuryType = 'payment';
        entity.documentType = 'demandNote';

        entity = this.treasuryRepository.create(entity);

        this.eventBus.send('onPaymentDemandNoteCreated', entity.id);

        return entity.id;
    }

    update(id, cmd) {
        let entity = this.mapToEntity(cmd),
            errors = this._receiveValidate(entity);

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