import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const publicFeatures = ['گزارشات', 'سرفصل حسابها', 'پنل کنترل دسترسی ها'];

@injectable()
export class PlanQuery {

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    @inject("Enums") enums = undefined;

    tableName = "storm_plans";

    find(where, single) {
        const knex = this.dbContext.instance;

        let query = knex.select('*').from(this.tableName);

        query.where('isActive', true);

        if (where)
            query.where(where);

        query.orderBy('order');

        if (single)
            query.first();

        let result = toResult(query);

        if (Array.isArray(result))
            result.forEach(item => this._map(item));
        else
            this._map(result);

        return result;
    }

    _map(item) {

        const enums = this.enums;

        let extraFeatures = item.name === 'Free' ? publicFeatures.filter(f => f !== 'پنل کنترل دسترسی ها') : publicFeatures;

        item.featuresDisplay = {
            api: item.features.api.map(f => enums.Features().getDisplay(f)),
            dashboard: item.features.dashboard.map(f => enums.Features().getDisplay(f)).concat(extraFeatures),
        };
    }

}