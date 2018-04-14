import {inject, injectable} from "inversify";
import {TreasuryRepository} from "../data/repository.treasury";
import {DetailAccountRepository} from "../data/repository.detailAccount";
import {TreasuryCashDomainService} from "./TreasuryCashDomainService";
import {TreasuryChequeDomainService} from "./TreasuryChequeDomainService";
import {TreasuryReceiptDomainService} from "./TreasuryReceiptDomainService";

const Guid = Utility.Guid,
    PersianDate = Utility.PersianDate;

@injectable()
export class TreasuryPurposeDomainService {

    /** @type {TreasuryPurposeRepository}*/
    @inject("TreasuryPurposeRepository") treasuryPurposeRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /** @type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    /** @type {JournalDomainService}*/
    @inject("JournalDomainService") journalDomainService = undefined;

    /** @type {TreasuryCashDomainService}*/
    @inject("TreasuryCashDomainService") treasuryCashDomainService = undefined;

    /** @type {TreasuryChequeDomainService}*/
    @inject("TreasuryChequeDomainService") treasuryChequeDomainService = undefined;

    /** @type {TreasuryReceiptDomainService}*/
    @inject("TreasuryReceiptDomainService") treasuryReceiptDomainService = undefined;


    /** @type {TreasuryJournalGenerationDomainService}*/
    @inject("TreasuryJournalGenerationDomainService") treasuryJournalGenerationDomainService = undefined;



    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;

    mapToEntity(cmd) {
        return {
            id: cmd.id,
            treasuryId: cmd.treasuryId || null,
            reference: cmd.reference,
            referenceId: cmd.referenceId,
            treasury: cmd.treasury || null
        }
    }

    _validate(entity) {

        let errors = [],
            invoice = entity.reference === 'invoice' ? this.invoiceRepository.findById(entity.referenceId) : null;

        if (!invoice)
            errors.push('فاکتور ثبت نشده است!');

        return errors;
    }

    create(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._validate(entity);

        if (errors.length > 0)
            throw new ValidationException(errors);

        if (entity.treasury.documentType === 'cheque')
            this.treasuryChequeDomainService.create(entity.treasury);

        if (entity.treasury.documentType === 'cash')
            this.treasuryCashDomainService.create(entity.treasury);

        if (entity.treasury.documentType === 'receipt')
            this.treasuryReceiptDomainService.create(entity.treasury);

        if (entity.treasury.documentType === 'spendCheque'){
            let treasury = entity.treasuryId ? this.treasuryRepository.findById(entity.treasuryId) : null;
            if (!treasury)
                throw new ValidationException(['چک با شماره {0} ثبت نشده است!'.format(treasury.documentDetail.number)]);

            this.treasuryChequeDomainService.chequeSpend(entity.treasury);
        }

        entity = this.treasuryPurposeRepository.create(entity);

        return entity.id;
    }

    remove(id) {
        return this.treasuryPurposeRepository.remove(id);
    }


    setJournal(id, journalId) {
    }
}