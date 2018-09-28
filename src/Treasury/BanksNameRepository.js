import toResult from "asyncawait/await";
import {BaseRepository} from "../Infrastructure/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class BanksNameRepository extends BaseRepository {

    findByName(title){
        let banksName = toResult(this.knex.table('banksName').where('title', title).first());

        if (!banksName) return null;

        return banksName;
    }

    create(entity){
        const trx = this.transaction;

        try {
            super.create(entity);

            toResult(trx('banksName').insert(entity));
            trx.commit();
            return entity;
        }
        catch (e){
            trx.rollback(e);

            throw new Error(e);
        }
    }

    update(id, entity){
    }

    remove(id){
    }

}