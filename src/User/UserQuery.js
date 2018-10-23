import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class UserQuery {

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    tableName = "users";

    baseQuery(fieldSize) {

        const knex = this.dbContext.instance;

        let sizes = {
            small: ['id', 'email', 'name', 'image', 'createdAt'],
            large: ['id', 'token', 'email', 'name', 'mobile', 'isActiveMobile', 'isActiveEmail', 'custom_fields', 'state', 'image','createdAt']
        };

        return knex.from(function () {
            this.select(...sizes[fieldSize])
                .from('users')
                .as('base');
        });
    }

    _view(user) {

        if (!user)
            return user;

        let localUser = Object.assign({}, user);

        delete localUser.custom_fields;
        //delete localUser.state;

        localUser.isRegistrationCompleted = !!(localUser.email && localUser.mobile);

        return Object.assign({}, localUser, user.custom_fields);
    }

    getAll(parameters) {

        return toResult(Utility.kendoQueryResolve(this.baseQuery('small'), parameters, this._view))
    }

    getByEmail(email) {

        let result = toResult(this.baseQuery('large')
            .select('*')
            .where('email', 'ILIKE', email)
            .where('state', 'active')
            .first()
        );

        return this._view(result);
    }

    getOne(where) {

        let query = this.baseQuery('large');

        if (where)
            query.where(where);

        let result = toResult(query.first());

        return this._view(result);
    }
}