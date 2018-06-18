import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex'),
    TokenGenerator = instanceOf('TokenGenerator');

@injectable()
export class UserRepository {

    tableName = "users";

    findOne(where) {

        let query = knex.select('*').from(this.tableName);

        if (where)
            query.where(where);


        return toResult(query.first());
    }

    isDuplicatedEmail(email) {
        return !!toResult(
            knex.select('*')
                .from(this.tableName)
                .where('state', 'active')
                .where('email', 'ILIKE', email)
                .first()
        );
    }

    isDuplicatedMobile(mobile) {
        return !!toResult(
            knex.select('*')
                .from(this.tableName)
                .where('state', 'active')
                .where('mobile', mobile)
                .first()
        );
    }

    findByEmailAndPassword(email, password) {
        return toResult(
            knex.select('id')
                .from(this.tableName)
                .where('state', 'active')
                .where('email', 'ILIKE', email)
                .where('password', password)
                .first()
        );
    }

    create(user) {
        toResult(knex(this.tableName).insert(user));
    }

    update(id, user) {
        toResult(knex(this.tableName).where({id}).update(user));
    }

}