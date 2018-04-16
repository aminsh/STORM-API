import {inject, injectable} from "inversify";


@injectable()
export class TreasuryPurposeDomainService {

    /** @type {TreasuryPurposeRepository}*/
    @inject("TreasuryPurposeRepository") treasuryPurposeRepository = undefined;

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /** @type {TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    /** @type {TreasuryCashDomainService}*/
    @inject("TreasuryCashDomainService") treasuryCashDomainService = undefined;

    /** @type {TreasuryChequeDomainService}*/
    @inject("TreasuryChequeDomainService") treasuryChequeDomainService = undefined;

    /** @type {TreasuryReceiptDomainService}*/
    @inject("TreasuryReceiptDomainService") treasuryReceiptDomainService = undefined;


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
            entity.treasuryId = this.treasuryChequeDomainService.create(entity.treasury);

        if (entity.treasury.documentType === 'cash')
            entity.treasuryId = this.treasuryCashDomainService.create(entity.treasury);

        if (entity.treasury.documentType === 'receipt')
            entity.treasuryId = this.treasuryReceiptDomainService.create(entity.treasury);

        if (entity.treasury.documentType === 'spendCheque'){
            let treasury = entity.treasuryId ? this.treasuryRepository.findById(entity.treasuryId) : null;
            if (!treasury)
                throw new ValidationException(['چک با شماره {0} ثبت نشده است!'.format(treasury.documentDetail.number)]);

            entity.treasuryId = this.treasuryChequeDomainService.chequeSpend(entity.treasury);
        }

        entity = this.treasuryPurposeRepository.create(entity);

        return entity.id;
    }
}