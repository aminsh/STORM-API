import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class UserOauthProfileRepository {

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    tableName = "users_oauth_profiles";

    create(entity){

        const knex = this.dbContext.instance;

        toResult(knex(this.tableName).insert(entity));
    }

    update(id, entity){

        const knex = this.dbContext.instance;

        toResult(knex(this.tableName).where({id}).update(entity));

    }

    getByProviderAndProfileId(provider, profileId){

        const knex = this.dbContext.instance;

        return toResult(
            knex.select('*').from(this.tableName)
                .where({provider, provider_user_id: profileId})
                .first()
        );
    }
}