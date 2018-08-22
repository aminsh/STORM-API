import {injectable, inject} from "inversify";
import {BaseDomainService, whenPropertyChanged} from "../Infrastructure/BaseDomainService";
import flatten from "flat";

@injectable()
export class TreasuryService extends BaseDomainService {

    /** @type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    @whenPropertyChanged("sourceDetailAccountId")
    changedSourceDetailAccountId() {
        let eventName = 'on' + this.capitalizeFirstLetter(this.existentValue.treasuryType)
            + this.capitalizeFirstLetter(this.existentValue.documentType) + 'Changed';
        this.eventBus.send(eventName, this.entity.id);
    }

    @whenPropertyChanged("destinationDetailAccountId")
    changedDestinationDetailAccountId() {
        let eventName = 'on' + this.capitalizeFirstLetter(this.existentValue.treasuryType)
            + this.capitalizeFirstLetter(this.existentValue.documentType) + 'Changed';
        this.eventBus.send(eventName, this.entity.id);
    }

    @whenPropertyChanged("amount")
    changedAmount() {
        let eventName = 'on' + this.capitalizeFirstLetter(this.existentValue.treasuryType)
            + this.capitalizeFirstLetter(this.existentValue.documentType) + 'Changed';
        this.eventBus.send(eventName, this.entity.id);
    }

    @whenPropertyChanged("transferDate")
    changedTransferDate() {
        let eventName = 'on' + this.capitalizeFirstLetter(this.existentValue.treasuryType)
            + this.capitalizeFirstLetter(this.existentValue.documentType) + 'Changed';
        this.eventBus.send(eventName, this.entity.id);
    }

    @whenPropertyChanged("documentDetail.date")
    changedDate() {
        let eventName = 'on' + this.capitalizeFirstLetter(this.existentValue.treasuryType)
            + this.capitalizeFirstLetter(this.existentValue.documentType) + 'Changed';
        this.eventBus.send(eventName, this.entity.id);
    }

    @whenPropertyChanged("documentDetail.number")
    changedNumber() {
        let eventName = 'on' + this.capitalizeFirstLetter(this.existentValue.treasuryType)
            + this.capitalizeFirstLetter(this.existentValue.documentType) + 'Changed';
        this.eventBus.send(eventName, this.entity.id);
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    mapToData(entity) {
        return {
            id: entity.id,
            transferDate: entity.transferDate,
            sourceDetailAccountId: entity.payerId || entity.sourceDetailAccountId,
            destinationDetailAccountId: entity.receiverId || entity.destinationDetailAccountId,
            amount: entity.amount && parseFloat(entity.amount),
            imageUrl: JSON.stringify(entity.imageUrl || []),
            description: entity.description,
            documentDetail: entity.documentDetail && this.mapDocumentDetail(entity.documentDetail)
        }
    }

    mapDocumentDetail(documentDetail) {
        return {
            id: documentDetail.id,
            transferTo: documentDetail.transferTo,
            transferFrom: documentDetail.transferFrom,
            number: documentDetail.number,
            issueDate: documentDetail.issueDate,
            date: documentDetail.date,
            dueDate: documentDetail.dueDate,
            bank: documentDetail.bank,
            bankBranch: documentDetail.bankBranch,
            payTo: documentDetail.payTo,
            chequeAccountNumber: documentDetail.chequeAccountNumber,
            canTransferToAnother: documentDetail.canTransferToAnother,
            identity: documentDetail.identity,
            trackingNumber: documentDetail.trackingNumber,
            totalTreasuryNumber: documentDetail.totalTreasuryNumber,
            paymentLocation: documentDetail.paymentLocation,
            paymentPlace: documentDetail.paymentPlace,
            nationalCode: documentDetail.nationalCode,
            residence: documentDetail.residence,
            demandNoteTo: documentDetail.demandNoteTo,
            status: documentDetail.status,
            chequeStatusHistory: documentDetail.documentType === 'cheque' ? JSON.stringify(documentDetail.chequeStatusHistory || []) : null
        }
    }

    _validate() {

        let errors = [],
            entity = flatten.unflatten(this.entity);

        if (entity.treasuryType === 'receive' &&  entity.documentDetail.status === 'spend')
            errors.push('امکان ویرایش چک دریافتی خرج شده وجود ندارد!');

        return errors;
    }

    update(id, cmd) {
        let dto = this.mapToData(cmd);
        dto = flatten(dto);

        this.repository = this.treasuryRepository;
        this.execute(id, dto);


        let errors = this._validate();

        if (errors.length > 0)
            throw new ValidationException(errors);

        let data = flatten.unflatten(this.data);
        Object.keys(data).length && this.treasuryRepository.patch(id, data);

        this.existentValue.documentType === 'spendCheque' && Object.keys(data).includes('destinationDetailAccountId') && this.existentValue.receiveId
            && this.treasuryRepository.patch(this.existentValue.receiveId, data);

        this.existentValue.journalId && this.submitEvents();
    }
}