"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base'),
    Promise = require('promise');

class JournalRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
        this.checkIsComplete = async(this.checkIsComplete);
    }

    findByTemporaryNumber(number, periodId) {
        return this.knex.table('journals')
            .where('periodId', periodId)
            .andWhere('temporaryNumber', number)
            .first();
    }

    findById(id) {
        return this.knex.table('journals')
            .where('id', id)
            .first();
    }

    maxTemporaryNumber(periodId) {
        return this.knex.table('journals')
            .where('periodId', periodId)
            .max();
    }

    create(entity) {
        entity.id = await(this.knex('journals')
            .returning('id')
            .insert(entity));

        return entity;
    }

    update(entity) {
        return this.knex('journals')
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('journals')
            .where('id', id)
            .del();
    }

    checkIsComplete(id) {
        let knex = this.knex,
            isInComplete = false,
            hasAnyLines = await(knex
                .from('journalLines')
                .where('journalId', id)
                .first());

        if (hasAnyLines) {
            let exp = this.knex
                    .raw('sum("debtor") - sum("creditor") as "remainder"'),

                remainder = await(this.knex.table('journalLines')
                    .select(exp)
                    .where('journalId', id)
                    .first()).remainder;

            isInComplete = remainder != 0;
        } else {
            isInComplete = true;
        }

        await(knex('journals')
            .where('id', id)
            .update({isInComplete}));

        return isInComplete;
    }

    updateTags(id, tagIds) {
        tagIds = tagIds.asEnumerable().select(t => parseInt(t)).toArray();

        let knex = this.knex,
            journalTagIds = (await(knex.select('tagId')
                .from('journalTags')
                .where('journalId', id)) || []).asEnumerable().select(t => t.tagId).toArray(),
            notExistInJournalTag = tagIds.asEnumerable()
                .where(t => !journalTagIds.includes(t))
                .toArray(),
            notExistInTag = journalTagIds.asEnumerable()
                .where(jt => !tagIds.includes(jt))
                .toArray();

        if (notExistInTag.length)
            await(knex.table('journalTags').whereIn('journalId', notExistInTag).del());

        if (notExistInJournalTag.length) {
            let addedTags = notExistInJournalTag.asEnumerable()
                .select(tj => ({
                    journalId: id,
                    tagId: tj
                }))
                .toArray();

            await(knex('journalTags').insert(addedTags));
        }


    }

    batchCreate(journalLines, journal) {
        let knex = this.knex;

        return new Promise((resolve, reject) => {
            knex.transaction(async function (trans) {
                try {
                    let id = await(kex('journal')
                        .transaction(trans)
                        .returning('id')
                        .insert(journal));

                    await(knex('journalLines')
                        .insert(journalLines));

                    trans.commit();
                    resolve(id);
                }
                catch (e) {
                    trans.rollback();
                    reject(e);
                }

            });
        });
    }

    batchUpdate(createJournalLines, updateJournalLine, deleteJournalLine, journal) {
        let knex = this.knex;

        return new Promise((resolve, reject) => {
            knex.transaction(async function (trx) {
                try {
                    let id = await(knex('journal')
                        .transacting(trx)
                        .returning('id')
                        .insert(journal));

                    await (knex('journalLines').tranacting(trx).insert(createJournalLines));
                    await (knex('journalLines').tranacting(trx).update(updateJournalLine));
                    await (knex('journalLines').transacting(trx)
                        .whereIn('id', deleteJournalLine)
                        .del());

                    trx.commit();
                    resolve(id);
                }
                catch (e) {
                    trx.rollback();
                    reject(e);
                }
            })
        });

    }
}

module.exports = JournalRepository;