import {inject, injectable} from "inversify";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class TreasuryReceiptDomainService {
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
            imageUrl: cmd.imageUrl,
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

    update(id, cmd) {
        let entity = this.mapToEntity(cmd),
            persistedTreasury = this.treasuryRepository.findById(id),
            errors = persistedTreasury.treasuryType === 'receive' ? this._receiveValidate(entity)
                : this._paymentValidate(entity);

        if (!persistedTreasury)
            errors.push('{0} وجود ندارد!'.format(Enums.TreasuryPaymentDocumentTypes().getDisplay(entity.documentType)));

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