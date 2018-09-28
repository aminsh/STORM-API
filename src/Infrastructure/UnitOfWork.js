import {inject, injectable} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class UnitOfWork {

    transaction = undefined;

    @inject("Factory<Repository>")
    repositoryFactory = undefined;

    start() {
        this.transaction = toResult(new Promise(resolve => instanceOf('knex').transaction(trx => resolve(trx))));
    }

    commit() {
        this.transaction.commit();
    }

    rollback(error) {
        this.transaction.rollback(error);
    }

    getRepository(repositoryName) {
        let instance = this.repositoryFactory(repositoryName);

        if (!instance)
            throw new Error(`Repository "${repositoryName}" is not defined`);

        instance.knex = this.transaction;

        return instance;
    }
}