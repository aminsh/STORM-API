import {inject, injectable, postConstruct} from "inversify";

const knex = instanceOf('knex'),
    Guid = Utility.Guid;


@injectable()
export class BaseRepository {

    /** @type {IState}*/
    @inject("State") state = undefined;

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
        entity.createdById = (this.state.user || {}).id;
    }

    modify(queryBuilder, branchId, fieldName) {
        queryBuilder
            .transacting(this.transaction)
            .where(fieldName || 'branchId', branchId);
    }

    get transaction() {
        return this.state.transaction;
    }
}

