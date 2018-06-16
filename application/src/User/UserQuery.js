import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex'),
    kendoQueryResolve = instanceOf('kendoQueryResolve');

@injectable()
export class UserQuery {

    tableName = "users";

    get baseQuery() {

        return knex.from(function () {
            this.select('id', 'token', 'email', 'name', 'mobile', 'isActiveMobile', 'isActiveEmail', 'custom_fields', 'state')
                .from('users')
                .as('base');
        });
    }

    _view(user) {

        if(!user)
            return user;

        let localUser = Object.assign({}, user);

        delete localUser.custom_fields;
        delete localUser.state;

        return Object.assign({}, localUser, user.custom_fields);
    }

    getAll(parameters) {

        return toResult(kendoQueryResolve(this.baseQuery, parameters, this._view))
    }

    getByEmail(email){
        let result = toResult(this.baseQuery
            .select('*')
            .where('email', 'ILIKE', email)
            .where('state', 'active')
            .first()
        );

        return this._view(result);
    }

    getOne(where) {
        let query = this.baseQuery;

        if (where)
            query.where(where);

        let result = toResult(query.first());

        return this._view(result);
    }
}