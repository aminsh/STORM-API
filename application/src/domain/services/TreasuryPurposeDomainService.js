import {inject, injectable} from "inversify";

@injectable()
export class TreasuryPurposeDomainService {

    /** @type {TreasuryPurposeRepository}*/
    @inject("TreasuryPurposeRepository") treasuryPurposeRepository = undefined;

    /** @type {TreasuryDomainService}*/
    @inject("TreasuryDomainService") treasuryDomainService = undefined;

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

    /** @type {DetailAccountRepository}*/
    @inject("DetailAccountRepository") detailAccountRepository = undefined;

    /** @type {EventBus}*/
    @inject("EventBus") eventBus = undefined;


    mapToEntity(cmd) {
        let payer = this.detailAccountRepository.findById(cmd.treasury.payerId);

        if (!payer)
            payer = this.detailAccountRepository.findByReferenceId(cmd.treasury.payerId);

        cmd.treasury.payerId = payer.id;

        return {
            id: cmd.id,
            treasuryId: cmd.treasuryId || cmd.treasury.receiveId || null,
            reference: cmd.reference,
            referenceIds: cmd.referenceId,
            treasury: cmd.treasury || null
        }
    }

    _validate(entity) {

        let errors = [],
            referenceIdsNotHaveInvoices = Array.isArray(entity.referenceIds)
                ? entity.referenceIds
                    .map(refId => this.invoiceRepository.findById(refId))
                    .filter(invoice => invoice === null)
                : this.invoiceRepository.findById(entity.referenceIds);

        if (Array.isArray(referenceIdsNotHaveInvoices) && referenceIdsNotHaveInvoices.length > 0)
            errors.push('فاکتور(های) موردنظر وجود ندارند!');

        if (!referenceIdsNotHaveInvoices)
            errors.push('فاکتور(های) موردنظر وجود ندارند!');

        return errors;
    }

    sumReferencesAmount(referenceIds) {
        let totalPrice = [];
        referenceIds.forEach(refId => {
            let invoice = this.invoiceRepository.findById(refId),
                sumCharges = (invoice.charges || []).asEnumerable()
                    .sum(c => c.value),
                sumChargesVatIncluded = (invoice.charges || []).asEnumerable()
                    .where(e => e.vatIncluded)
                    .sum(e => e.value),
                invoiceDiscount = invoice.discount || 0,

                lineHaveVat = invoice.invoiceLines.asEnumerable().firstOrDefault(e => e.vat !== 0),
                persistedVat = lineHaveVat
                    ? (100 * lineHaveVat.vat / (((lineHaveVat.quantity * lineHaveVat.unitPrice) - lineHaveVat.discount)))
                    : 0,

                totalPrice = invoice.invoiceLines.asEnumerable()
                        .sum(line => line.quantity * line.unitPrice - line.discount + line.vat)
                    - invoiceDiscount +
                    sumCharges + (sumChargesVatIncluded * persistedVat / 100)

            totalPrice.push(totalPrice);

        });
        return totalPrice.asEnumerable().sum(tPrice => tPrice)
    }

    create(cmd) {

        let entity = this.mapToEntity(cmd),
            errors = this._validate(entity),
            referenceIds = entity.referenceIds;

        if (errors.length > 0)
            throw new ValidationException(errors);

        if (entity.treasuryId && entity.treasury.documentType !== 'spendCheque') {
            let treasuryPurposes = this.treasuryPurposeRepository.findReferenceIdsByTreasuryId(entity.treasuryId)
                .asEnumerable().select(item => item.referenceId).toArray();

            let shouldDeletedPurpose = treasuryPurposes.asEnumerable()
                    .where(tp => !entity.referenceIds.asEnumerable().any(refId => refId == tp))
                    .toArray(),
                shouldAddedPurpose = entity.referenceIds.asEnumerable()
                    .where(refId => !treasuryPurposes.asEnumerable().any(tp => tp == refId))
                    .toArray();
            this.treasuryDomainService.update(entity.treasuryId, entity.treasury);

            if (shouldAddedPurpose.asEnumerable().any()) {
                shouldAddedPurpose.forEach(refId => {
                    entity.referenceId = refId;
                    this.treasuryPurposeRepository.create(entity);
                })
            }
            if (shouldDeletedPurpose.asEnumerable().any()) {
                shouldDeletedPurpose.forEach(refId => {
                    this.treasuryPurposeRepository.removeByReferenceId(refId);
                });
            }
        }

        else {
            if (entity.treasury.documentType === 'cheque')
                entity.treasuryId = this.treasuryChequeDomainService.create(entity.treasury);

            if (entity.treasury.documentType === 'cash')
                entity.treasuryId = this.treasuryCashDomainService.create(entity.treasury);

            if (entity.treasury.documentType === 'receipt')
                entity.treasuryId = this.treasuryReceiptDomainService.create(entity.treasury);

            if (entity.treasury.documentType === 'spendCheque') {
                let treasury = entity.treasuryId ? this.treasuryRepository.findById(entity.treasuryId) : null;
                if (!treasury)
                    throw new ValidationException(['چک با شماره {0} ثبت نشده است!'.format(entity.treasury.documentDetail.number)]);

                entity.treasuryId = this.treasuryChequeDomainService.chequeSpend(entity.treasury);
            }
            if (Array.isArray(entity.referenceIds))
                entity.referenceIds.forEach(refId => {
                    entity.referenceId = refId;
                    this.treasuryPurposeRepository.create(entity);
                });
            else {
                entity.referenceId = entity.referenceIds;
                this.treasuryPurposeRepository.create(entity)
            }
        }

        Utility.delay(500);

        //entity = this.treasuryPurposeRepository.create(entity);

        this.eventBus.send("invoicesPaymentChanged", referenceIds);

        return entity.id;
    }

    remove(treasuryId) {
        this.treasuryPurposeRepository.removeByTreasuryId(treasuryId);
    }
}