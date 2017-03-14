"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base'),
    Promise = require('promise');

class ChequeCategoryRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {
        return this.knex.table('chequeCategories')
            .where('id', id)
            .first();
    }

    hasCheque(id){
        return  this.knex('cheques')
            .where('chequeCategoryId', id)
            .first();
    }

    create(entity) {
        let knex = this.knex,
            handler = (resolve, reject) => {
                knex.transaction(async(trx => {
                    try {
                        let cheques = entity.cheques;

                        delete entity.cheques;

                        let ids = await(knex('chequeCategories')
                            .transacting(trx)
                            .returning('id')
                            .insert(entity));

                        cheques.forEach(c => c.chequeCategoryId = ids[0]);

                        await(knex('cheques')
                            .transacting(trx)
                            .insert(cheques));

                        trx.commit();

                        entity.id = ids[0];

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
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('chequeCategories')
            .where('id', id)
            .del();
    }
}


module.exports = ChequeCategoryRepository;


