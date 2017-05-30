"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base'),
    Promise = require('promise'),
    Guid = require('../services/shared').utility.Guid;

class ChequeCategoryRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {
        return this.knex.table('chequeCategories')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    hasCheque(id){
        return  this.knex('cheques')
            .modify(this.modify, this.branchId)
            .where('chequeCategoryId', id)
            .first();
    }

    create(entity) {
        super.create(entity);

        let knex = this.knex,
            createBase = super.create,
            handler = (resolve, reject) => {
                knex.transaction(async(trx => {
                    try {
                        let cheques = entity.cheques;

                        delete entity.cheques;

                        await(knex('chequeCategories')
                            .transacting(trx)
                            .insert(entity));

                        cheques.forEach(c => {
                            createBase(c);
                            c.id = Guid.new();
                            c.chequeCategoryId = entity.id;
                        });

                        await(knex('cheques')
                            .transacting(trx)
                            .insert(cheques));

                        trx.commit();

                        resolve(entity);
                    }
                    catch (e) {
                        trx.rollback();
                        reject(e);
                    }
                }));
            };

        return new Promise(handler);
    }

    update(entity) {
        return this.knex('chequeCategories')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('chequeCategories')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del();
    }
}


module.exports = ChequeCategoryRepository;


