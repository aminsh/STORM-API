import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex'),
    Enums = instanceOf('Enums'),
    publicFeatures = ['گزارشات', 'سرفصل حسابها', 'پنل کنترل دسترسی ها'];

@injectable()
export class PlanQuery {

    tableName = "storm_plans";

    find(where, single) {
        let query = knex.select('*').from(this.tableName);

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

        let extraFeatures = item.name === 'Free' ? publicFeatures.filter(f => f !== 'پنل کنترل دسترسی ها') : publicFeatures;

        item.featuresDisplay = {
            api: item.features.api.map(f => Enums.Features().getDisplay(f)),
            dashboard: item.features.dashboard.map(f => Enums.Features().getDisplay(f)).concat(extraFeatures),
        };
    }

}