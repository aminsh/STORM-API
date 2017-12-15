"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = require('../services/shared').utility.Guid,
    BaseRepository = require('./repository.base'),
    JournalLineRepository = require('./repository.journalLine'),
    Promise = require('promise');

class JournalRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    findByNumberExpectId(notEqualId, number, periodId) {
        return this.knex.table('journals')
            .modify(this.modify, this.branchId)
            .where('id', '!=', notEqualId)
            .andWhere('periodId', periodId)
            .andWhere('temporaryNumber', number)
            .first();
    }

    findByTemporaryNumber(number, periodId) {
        return this.knex.table('journals')
            .modify(this.modify, this.branchId)
            .where('periodId', periodId)
            .andWhere('temporaryNumber', number)
            .first();
    }

    findById(id) {
        let journal =  await(this.knex.table('journals')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());

        journal.journalLines = await(this.knex.select('*').from('journalLines')
            .where('branchId', this.branchId)
            .where('journalId', id));

        return journal;
    }

    findByJournalLinesById(id) {
        return this.knex.select('*').from('journalLines')
            .modify(this.modify, this.branchId)
            .where('journalId', id);
    }

    maxTemporaryNumber(periodId) {
        return await(this.knex.table('journals')
            .modify(this.modify, this.branchId)
            .where('periodId', periodId)
            .max('temporaryNumber')
            .first());
    }

    create(entity) {
        super.create(entity);

        await(this.knex('journals').insert(entity));

        return entity.id;
    }

    update(entity) {
        return await(this.knex('journals')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity));
    }

    remove(id) {
        return await(this.knex('journals')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }

    checkIsComplete(id) {
        let knex = this.knex,
            isInComplete = false,
            hasAnyLines = await(knex
                .from('journalLines')
                .modify(this.modify, this.branchId)
                .where('journalId', id)
                .first());

        if (hasAnyLines) {
            let exp = this.knex
                    .raw('sum("debtor") - sum("creditor") as "remainder"'),

                remainder = await(this.knex.table('journalLines')
                    .select(exp)
                    .modify(this.modify, this.branchId)
                    .where('journalId', id)
                    .first()).remainder;

            isInComplete = remainder != 0;
        } else {
            isInComplete = true;
        }

        await(knex('journals')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .update({isInComplete}));

        return isInComplete;
    }

    updateTags(id, tagIds) {
        tagIds = tagIds.asEnumerable()
            .select(t => parseInt(t)).toArray();

        let knex = this.knex,
            journalTagIds = (await(knex.select('tagId')
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
            await(knex.table('journalTags')
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

            await(knex('journalTags').insert(addedTags));
        }
    }

    batchCreate(journalLines, journal) {
        super.create(journal);

        const trx = await(this.transaction),
            knex = this.knex;

        try {

            await(knex('journals').transacting(trx).insert(journal));

            journalLines.forEach(line => {

                if(line.id)
                    line.branchId = this.branchId;
                else
                    super.create(line);

                line.journalId = journal.id;
            });

            await(knex('journalLines').transacting(trx).insert(journalLines));

            trx.commit();

            return journal.id;
        }
        catch (e) {

            trx.rollback();

            throw new Error(e);
        }
    }

    _updateLines(id, lines, trx) {
        let persistedLines = await(this.knex.table('journalLines').where('journalId', id)),

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

            await(this.knex('journalLines')
                .transacting(trx)
                .insert(shouldAddedLines));
        }

        if (shouldDeletedLines.asEnumerable().any())
            await(this.knex('journalLines')
                .transacting(trx)
                .whereIn('id', shouldDeletedLines.asEnumerable().select(item => item.id).toArray()).del());

        if (shouldUpdatedLines.asEnumerable().any())
            shouldUpdatedLines.forEach(e => await(this.knex('journalLines')
                .transacting(trx).where('id', e.id).update(e)));
    }

    batchUpdate(id, journal) {
        const knex = this.knex,
            trx = await(this.transaction);

        try {

            let lines = journal.journalLines;
            delete journal.journalLines;

            await(knex('journals')
                .transacting(trx)
                .where('id', id)
                .update(journal));

            this._updateLines(id, lines, trx);

            trx.commit();
        }
        catch (e) {
            trx.rollback();

            throw new Error(e);
        }
    }

    isExistsDetailAccount(detailAccountId) {
        return await(this.knex.select('id').from('journalLines')
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

        return await(this.knex.raw(query));
    }
}

module.exports = JournalRepository;
