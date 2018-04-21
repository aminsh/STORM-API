import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class TreasurySettingRepository extends BaseRepository {

    create(entity) {
        super.create(entity);

        return this.knex('treasurySettings').insert(entity);
    }

    update(entity) {
        return toResult(this.knex('treasurySettings')
            .modify(this.modify, this.branchId)
            .update(entity));
    }

    get() {
        return toResult(this.knex.table('treasurySettings')
            .modify(this.modify, this.branchId)
            .first());
    }

    createOnUndefined(){
        let entity = {
            subsidiaryLedgerAccounts: JSON.stringify([])
        };
        super.create(entity);

        return this.knex('treasurySettings').insert(entity);
    }

}
