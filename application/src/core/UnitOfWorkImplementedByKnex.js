import {inject, injectable, postConstruct} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class UnitOfWorkImplementedByKnex {

    /**@type {IState}*/
    @inject("State") state = undefined;

    init(){
        this.state.transaction = toResult(new Promise(resolve => instanceOf('knex').transaction(trx => resolve(trx))));
    }

    commit() {
        toResult(this.state.transaction.commit());
    }

    rollback(error) {
        toResult(this.state.transaction.rollback(error));
    }
}