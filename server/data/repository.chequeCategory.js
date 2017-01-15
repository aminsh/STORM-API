"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class ChequeCategoryRepository {
    constructor(knex) {
        this.knex = knexl
    }

    findById(id) {
        return this.knex.table('chequeCategories')
            .where('id', id)
            .first();
    }

    create(entity) {
        knex.transaction((trx) => {
            try {
                let id = await(knex('chequeCategories')
                    .transaction(trx)
                    .returning('id')
                    .insert(entity));

                entity.cheques.forEach(c => c.chequeCategoryId = id);

                await(this.knex('cheques')
                    .transaction(trx)
                    .insert(entity.cheques));

                trx.commit();
            }
            catch (e) {
                trx.rollback();
            }
        });
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


