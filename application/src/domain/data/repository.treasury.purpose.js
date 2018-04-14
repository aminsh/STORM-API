"use strict";

import toResult from "asyncawait/await";
import {inject, injectable} from "inversify";
import {BaseRepository} from "./repository.base";

@injectable()
class TreasuryPurposeRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
    }

    /** @type {InvoiceRepository}*/
    @inject("InvoiceRepository") invoiceRepository = undefined;

    /**@type{TreasuryRepository}*/
    @inject("TreasuryRepository") treasuryRepository = undefined;

    findById(id) {

        let treasuryPurpose = toResult(this.knex.select('treasuryPurpose.*')
            .from('treasuryPurpose')
            .modify(this.modify, this.branchId, 'treasuryPurpose.branchId')
            .where('id', id)
            .first()
        );

        treasuryPurpose.treasury = this.treasuryRepository.findById(treasuryPurpose.treasuryId);

        treasuryPurpose.invoice = this.invoiceRepository.findById(treasuryPurpose.referenceId);


        if (!treasuryPurpose) return null;

        return treasuryPurpose;
    }

    create(entity) {
        const trx = this.transaction;
        try {

            if (entity.treasury)
                delete entity.treasury;

            super.create(entity);
            toResult(trx('treasuryPurpose').insert(entity));

            trx.commit();
            return entity;
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    update(id, entity) {
        let trx = this.transaction;

        try {

            toResult(trx('treasuryPurpose').where('id', id)
                .modify(this.modify, this.branchId)
                .update(entity));

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    removeByReferenceId(id) {
        let trx = this.transaction;
        try {
            return toResult(trx('treasuryPurpose').where('referenceId', id).del());

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    removeByTreasuryId(id) {
        let trx = this.transaction;
        try {
            return toResult(trx('treasuryPurpose').where('treasuryId', id).del());

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

}

module.exports = TreasuryPurposeRepository;