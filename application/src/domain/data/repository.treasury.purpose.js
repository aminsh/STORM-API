"use strict";

import toResult from "asyncawait/await";
import {inject, injectable} from "inversify";
import {BaseRepository} from "./repository.base";

@injectable()
export class TreasuryPurposeRepository extends BaseRepository {

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

    findByReferenceId(referenceId) {
        return toResult(
            this.knex
                .select('treasuryPurpose.id', 'treasury.transferDate', 'treasury.amount')
                .from('treasuryPurpose')
                .leftJoin('treasury', 'treasury.id', 'treasuryPurpose.treasuryId')
                .modify(this.modify, this.branchId, 'treasuryPurpose.branchId')
                .where({referenceId})
        );
    }

    findReferenceIdsByTreasuryId(id){
        return toResult(
            this.knex
                .select('*')
                .from('treasuryPurpose')
                .modify(this.modify, this.branchId, 'treasuryPurpose.branchId')
                .where('treasuryId', id)
        );
    }

    create(entity) {
        const trx = this.transaction;
        try {

            if (entity.treasury)
                delete entity.treasury;

            if (entity.referenceIds)
                delete entity.referenceIds;

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