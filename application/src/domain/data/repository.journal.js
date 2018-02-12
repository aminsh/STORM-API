import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class JournalRepository extends BaseRepository {

    findByNumberExpectId(notEqualId, number, periodId) {
        return toResult(this.knex.table('journals')
            .modify(this.modify, this.branchId)
            .where('id', '!=', notEqualId)
            .andWhere('periodId', periodId)
            .andWhere('temporaryNumber', number)
            .first());
    }

    findByTemporaryNumber(number, periodId) {
        return toResult(this.knex.table('journals')
            .modify(this.modify, this.branchId)
            .where('periodId', periodId)
            .andWhere('temporaryNumber', number)
            .first());
    }

    findById(id) {
        let journal =  toResult(this.knex.table('journals')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());

        journal.journalLines = toResult(this.knex.select('*').from('journalLines')
            .modify(this.modify, this.branchId)
            .where('journalId', id));

        return journal;
    }

    findByJournalLinesById(id) {
        return toResult(this.knex.select('*').from('journalLines')
            .modify(this.modify, this.branchId)
            .where('journalId', id));
    }

    maxTemporaryNumber(periodId) {
        return toResult(this.knex.table('journals')
            .modify(this.modify, this.branchId)
            .where('periodId', periodId)
            .max('temporaryNumber')
            .first());
    }

    create(entity) {
        super.create(entity);

        toResult(this.knex('journals')
            .transacting(this.transaction)
            .insert(entity));

        return entity.id;
    }

    update(entity) {
        return toResult(this.knex('journals')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity));
    }

    remove(id) {
        return toResult(this.knex('journals')
            .modify(this.modify, this.branchId)
            .transacting(this.transaction)
            .where('id', id)
            .del());
    }

    checkIsComplete(id) {
        let knex = this.knex,
            isInComplete = false,
            hasAnyLines = toResult(knex
                .from('journalLines')
                .modify(this.modify, this.branchId)
                .where('journalId', id)
                .first());

        if (hasAnyLines) {
            let exp = this.knex
                    .raw('sum("debtor") - sum("creditor") as "remainder"'),

                remainder = toResult(this.knex.table('journalLines')
                    .select(exp)
                    .modify(this.modify, this.branchId)
                    .where('journalId', id)
                    .first()).remainder;

            isInComplete = remainder !== 0;
        } else {
            isInComplete = true;
        }

        toResult(knex('journals')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .update({isInComplete}));

        return isInComplete;
    }

    updateTags(id, tagIds) {
        tagIds = tagIds.asEnumerable()
            .select(t => parseInt(t)).toArray();

        let knex = this.knex,
            journalTagIds = (toResult(knex.select('tagId')
                .modify(this.modify, this.branchId)
                .from('journalTags')
                .where('journalId', id)) || []).asEnumerable().select(t => t.tagId).toArray(),
            notExistInJournalTag = tagIds.asEnumerable()
                .where(t => !journalTagIds.includes(t))
                .toArray(),
            notExistInTag = journalTagIds.asEnumerable()
                .where(jt => !tagIds.includes(jt))
                .toArray();

        if (notExistInTag.length)
            toResult(knex.table('journalTags')
                .modify(this.modify, this.branchId)
                .whereIn('journalId', notExistInTag).del());

        if (notExistInJournalTag.length) {
            let addedTags = notExistInJournalTag.asEnumerable()
                .select(tj => ({
                    journalId: id,
                    tagId: tj
                }))
                .toArray();

            addedTags.forEach(t => super.create(t));

            toResult(knex('journalTags')
                .transacting(this.transaction)
                .insert(addedTags));
        }
    }

    batchCreate(journalLines, journal) {
        super.create(journal);

        const trx = this.transaction,
            knex = this.knex;

        toResult(knex('journals').transacting(trx).insert(journal));

        journalLines.forEach(line => {

            if(line.id)
                line.branchId = this.branchId;
            else
                super.create(line);

            line.journalId = journal.id;
        });

        toResult(knex('journalLines').transacting(trx).insert(journalLines));

        return journal.id;
    }

    _updateLines(id, lines, trx) {
        let persistedLines = toResult(this.knex.table('journalLines')
                .modify(this.modify, this.branchId)
                .where('journalId', id)),

            shouldDeletedLines = persistedLines.asEnumerable()
                .where(e => !lines.asEnumerable().any(p => p.id === e.id))
                .toArray(),
            shouldAddedLines = lines.asEnumerable()
                .where(e => !persistedLines.asEnumerable().any(p => p.id === e.id))
                .toArray(),
            shouldUpdatedLines = lines.asEnumerable()
                .where(e => persistedLines.asEnumerable().any(p => p.id === e.id))
                .toArray();

        if (shouldAddedLines.asEnumerable().any()) {
            shouldAddedLines.forEach(line => {
                super.create(line);
                line.journalId = id;
            });

            toResult(this.knex('journalLines')
                .transacting(trx)
                .insert(shouldAddedLines));
        }

        if (shouldDeletedLines.asEnumerable().any())
            toResult(this.knex('journalLines')
                .transacting(trx)
                .whereIn('id', shouldDeletedLines.asEnumerable().select(item => item.id).toArray()).del());

        if (shouldUpdatedLines.asEnumerable().any())
            shouldUpdatedLines.forEach(e => toResult(this.knex('journalLines')
                .transacting(trx).where('id', e.id).update(e)));
    }

    batchUpdate(id, journal) {
        const knex = this.knex,
            trx = this.transaction;

        let lines = journal.journalLines;
        delete journal.journalLines;

        toResult(knex('journals')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .update(journal));

        this._updateLines(id, lines, trx);
    }

    isExistsDetailAccount(detailAccountId) {
        return toResult(this.knex.select('id').from('journalLines')
            .modify(this.modify, this.branchId)
            .where('detailAccountId', detailAccountId)
            .first())
    }

    orderingTemporaryNumberByTemporaryDate(fiscalPeriodId) {
        const branchId = this.branchId,
            query = `update journals
                        set "temporaryNumber" = subquery.row
                    from(
                        select 
                            id,
                            ROW_NUMBER () OVER (ORDER BY "temporaryDate") as row
                        from journals as j 
                        where "branchId" = '${branchId}'
                        and "periodId" = '${fiscalPeriodId}'
                        ) as subquery
                    where "branchId" = '${branchId}'
                    and "periodId" = '${fiscalPeriodId}'
                    and journals.id = subquery.id`;

        return toResult(this.knex.raw(query));
    }
}
