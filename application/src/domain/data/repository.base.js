import {inject, injectable, postConstruct} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex'),
    Guid = Utility.Guid;


@injectable()
export class BaseRepository {

    /** @type {IState}*/
    @inject("State") state = undefined;

    _knex = knex;
    _createdByUnitOfWork = false;
    branchId = undefined;

    get knex(){
        return this._knex;
    }

    set knex(value){
        this._knex = value;
        this._createdByUnitOfWork = true;
    }

    @postConstruct()
    onLoad() {
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
        queryBuilder.where(fieldName || 'branchId', branchId);
    }

    get transaction() {
        return toResult(new Promise(resolve => knex.transaction(trx => resolve(trx))));
    }


}

