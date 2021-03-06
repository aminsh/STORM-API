import toResult from "asyncawait/await";
import {BaseRepository} from "../Infrastructure/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class TreasuryRepository extends BaseRepository {

    findById(id) {

        let treasury = toResult(this.knex.select('treasury.*')
                .from('treasury')
                .modify(this.modify, this.branchId, 'treasury.branchId')
                .where('id', id)
                .first()
            ),

            treasuryDocumentDetail = toResult(this.knex.select('treasuryDocumentDetails.*')
                .from('treasuryDocumentDetails')
                .modify(this.modify, this.branchId, 'treasuryDocumentDetails.branchId')
                .where('id', treasury.documentDetailId)
                .first()
            );

        treasury.documentDetail = treasuryDocumentDetail;

        if (!treasury) return null;

        return treasury;
    }

    findByNumber(number) {
        let query = this.knex.table('treasuryDocumentDetails')
            .innerJoin('treasury', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
            .modify(this.modify, this.branchId, 'treasury.branchId')
            .where('number', number);

        return toResult(query.first());
    }

    createTreasury(entity, trx) {
        super.create(entity);
        toResult(trx('treasury').insert(entity));
        return entity;
    }

    createDocumentDetail(entity, trx) {
        super.create(entity);
        toResult(trx('treasuryDocumentDetails').insert(entity));
        return entity;
    }

    create(entity) {
        const trx = this.transaction;
        try {

            let documentDetail = entity.documentDetail;

            delete entity.documentDetail;

            if (documentDetail)
                toResult(this.createDocumentDetail(documentDetail, trx));
            entity.documentDetailId = documentDetail ? documentDetail.id : null;

            toResult(this.createTreasury(entity, trx));

            entity.documentDetail = documentDetail;

            trx.commit();
            return entity;
        }
        catch (e) {
            trx.rollback(e);

            throw new Error(e);
        }
    }

    updateTreasury(id, entity, trx) {
        toResult(trx('treasury').where('id', id)
            .modify(this.modify, this.branchId)
            .update(entity));
    }

    updateDocumentDetail(entity, trx) {
        toResult(trx('treasuryDocumentDetails').where('id', entity.id)
            .modify(this.modify, this.branchId)
            .update(entity));
    }

    update(id, entity) {
        let trx = this.transaction;

        try {

            let documentDetail = entity.documentDetail,
                persistedDocumentDetail = this.findById(entity.id);

            delete entity.documentDetail;

            if (documentDetail && persistedDocumentDetail.documentDetailId)
                toResult(this.updateDocumentDetail(documentDetail, trx));

            if (documentDetail && !persistedDocumentDetail.documentDetailId) {
                toResult(this.createDocumentDetail(documentDetail, trx));
                entity.documentDetailId = documentDetail.id;
            }

            toResult(this.updateTreasury(id, entity, trx));

            entity.documentDetail = documentDetail;

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);

            throw new Error(e);
        }
    }

    patch(id, entity) {
        let trx = this.transaction;

        try {

            let documentDetail = entity.documentDetail || null;
            delete entity.documentDetail;

            Object.keys(entity).length && toResult(this.updateTreasury(id, entity, trx));

            if (documentDetail) {
                let documentDetailId = toResult(this.knex.select('documentDetailId')
                    .from('treasury')
                    .modify(this.modify, this.branchId, 'treasury.branchId')
                    .where('treasury.id', id)
                    .first()
                );

                documentDetail.id = documentDetailId.documentDetailId;

                toResult(this.updateDocumentDetail(documentDetail, trx));
            }
            trx.commit();
            return entity.documentDetail = documentDetail;
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    removeTreasury(id, trx) {
        return toResult(trx('treasury').where('id', id).del());
    }

    removeDocumentDetail(documentDetailId, trx) {
        return toResult(trx('treasuryDocumentDetails').where('id', documentDetailId).del());
    }

    remove(id) {
        let trx = this.transaction,
            persistedTreasury = this.findById(id);

        try {
            toResult(this.removeTreasury(id, trx));
            toResult(this.removeDocumentDetail(persistedTreasury.documentDetailId, trx));

            trx.commit();
        }
        catch (e) {
            trx.rollback(e);
            throw new Error(e);
        }
    }

    isExitsJournal(journalId) {
        return toResult(this.knex('id')
            .from('treasury')
            .modify(this.modify, this.branchId)
            .where('journalId', journalId)
            .first());
    }

    isSpendCheque(id) {
        return toResult(this.knex('id')
            .from('treasury')
            .modify(this.modify, this.branchId)
            .where('receiveId', id)
            .first());
    }
}