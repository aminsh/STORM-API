import {injectable, postConstruct} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class UnitOfWorkImplementedByKnex {

    currentTransaction = undefined;

    @postConstruct()
    init() {
        let knex = instanceOf('knex');
        this.currentTransaction = toResult(new Promise(resolve => knex.transaction(trx => resolve(trx))));
    }

    commit() {
        this.currentTransaction.commit();
    }

    rollback(error) {
        this.currentTransaction.rollback(error);
    }
}