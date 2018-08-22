import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class ThirdPartyQuery {

    @inject("DbContext") dbContext = undefined;

    @inject("Context") context = undefined;

    @inject("Enums") Enums = undefined;

    tableName = "branchThirdParty";

    getAll() {
        let knex = this.dbContext.instance,
            branchId = this.context.branchId;

        let allThirdParties = this.Enums.ThirdParty().data,
            allSelectedThirdParties = toResult(knex.from(this.tableName)
                .where('branchId', branchId));

        return allThirdParties
            .asEnumerable()
            .groupJoin(
                allSelectedThirdParties,
                all => all.key,
                selected => selected.key,
                (all, items) => ({
                    key: all.key,
                    display: all.data.display,
                    title: all.data.title,
                    logo: all.data.logo,
                    description: all.data.description,
                    website: all.data.website,
                    isActivated: items.any()
                })
            )
            .toArray();
    }

    get(keys) {

        const knex = this.dbContext.instance;

        let query = knex.from(this.tableName).where({branchId: this.context.branchId});

        if (keys) {

            if (Array.isArray(keys))
                query.whereIn('key', keys);
            else
                query.where({key: keys});
        }

        return toResult(query);
    }
}