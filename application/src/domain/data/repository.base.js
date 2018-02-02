import {inject, injectable, postConstruct} from "inversify";

const knex = instanceOf('knex'),
    Guid = Utility.Guid;


@injectable()
export class BaseRepository {

    /** @type {IState}*/
    @inject("State") state = undefined;

    @inject("UnitOfWork") unitOfWork = undefined;

    knex = undefined;
    branchId = undefined;

    @postConstruct()
    onLoad() {
        this.knex = knex;
        this.branchId = this.state.branchId;
    }

    constructor(branchId) {

    }

    create(entity) {
        entity.id = Guid.new();
        entity.branchId = this.branchId;
    }

    modify(queryBuilder, branchId) {
        queryBuilder.where('branchId', branchId);
    }

    get transaction() {
        return this.unitOfWork.currentTransaction;
    }
}

