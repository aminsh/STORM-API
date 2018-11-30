import {injectable, inject, postConstruct} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class RegisteredThirdPartyRepository  {

    tableName = 'branchThirdParty';

    @inject("State") context = undefined;

    @inject("DbContext") dbContext = undefined;

    knex = undefined;

    @postConstruct()
    init(){
        this.knex = this.dbContext.instance;
    }

    get(key) {
        return toResult(this.knex.from(this.tableName)
            .where({branchId: this.context.branchId, key})
            .first()
        );
    }

    create(entity) {
        entity.branchId = this.context.branchId;

        toResult(this.knex(this.tableName).insert(entity));
    }

    update(key, data) {

        toResult(
            this.knex(this.tableName)
                .where({branchId: this.context.branchId, key})
                .update({data})
        );
    }

    remove(key) {
        toResult(
            this.knex(this.tableName)
                .where({branchId: this.context.branchId, key})
                .del()
        );
    }
}