"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class ChequeCategoryRepository {
    constructor(knexService) {
        this.knexService = knexServicel
    }

    findById(id) {
        return this.knexService.table('chequeCategories')
            .where('id', id)
            .first();
    }

    create(entity) {
        knexService.transaction((trx) => {
            try {
                let id = await(knexService('chequeCategories')
                    .transaction(trx)
                    .returning('id')
                    .insert(entity));

                entity.cheques.forEach(c => c.chequeCategoryId = id);

                await(this.knexService('cheques')
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
        return this.knexService('chequeCategories')
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knexService('chequeCategories')
            .where('id', id)
            .del();
    }
}


module.exports = ChequeCategoryRepository;


