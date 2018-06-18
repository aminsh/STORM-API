import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex'),
    Enums = instanceOf('Enums');

@injectable()
export class PlanQuery {

    tableName = "storm_plans";

    find(where) {
        let query = knex.select('*').from(this.tableName);

        if (where)
            query.where(where);

        query.orderBy('order');

        let result = toResult(query),
            publicFeatures = ['گزارشات', 'سرفصل حسابها', 'پنل کنترل دسترسی ها'];

        result.forEach(item => {

            let extraFeatures = item.name === 'Free' ? publicFeatures.filter(f => f !== 'پنل کنترل دسترسی ها') : publicFeatures;

            item.featuresDisplay = {
                api: item.features.api.map(f => Enums.Features().getDisplay(f)),
                dashboard: item.features.dashboard.map(f => Enums.Features().getDisplay(f)).concat(extraFeatures),
            };
        });

        return result;
    }

}