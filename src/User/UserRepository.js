import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class UserRepository {

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    tableName = "users";

    findOne(where) {

        const knex = this.dbContext.instance;

        let query = knex.select('*').from(this.tableName);

        if (where)
            query.where(where);


        return toResult(query.first());
    }

    findByEmail(email) {
        const knex = this.dbContext.instance;

        return toResult(
            knex.select('*')
                .from(this.tableName)
                .where('state', 'active')
                .where('email', 'ILIKE', email)
                .first()
        );
    }


    isDuplicatedEmail(email) {
        const knex = this.dbContext.instance;

        return !!toResult(
            knex.select('*')
                .from(this.tableName)
                .where('state', 'active')
                .where('email', 'ILIKE', email)
                .first()
        );
    }

    isDuplicatedMobile(mobile) {
        const knex = this.dbContext.instance;

        return !!toResult(
            knex.select('*')
                .from(this.tableName)
                .where('state', 'active')
                .where('mobile', mobile)
                .first()
        );
    }

    findByEmailAndPassword(email, password) {
        const knex = this.dbContext.instance;

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
        const knex = this.dbContext.instance;

        toResult(knex(this.tableName).insert(user));
    }

    update(id, user) {
        const knex = this.dbContext.instance;

        toResult(knex(this.tableName).where({id}).update(user));
    }

}